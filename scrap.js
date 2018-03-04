console.time("exec");

var request = require("request");
var cheerio = require("cheerio");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TOPCHEF');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const FOURCHETTE_BASE_URL = "https://m.lafourchette.com/api/restaurant-prediction?";
const MICHELIN_BASE_URL = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin";
const NUMBER_OF_PAGES = 35;

var Restaurant = require("./models/Restaurant");

start();


function start()
{
	console.log(">>Launching scrapping script.");
	Restaurant.deleteMany({}).then(function (result) {
		console.log(">>All previous documents have been deleted ("+result.n+" docs).");
		launchScrapping();
	});
}

function launchScrapping(){

	var count = 1;
	var restaurants = [];
	var requestDone = 0;

	let urls = [];

	for(var i = 0; i < NUMBER_OF_PAGES; i++)
	{
		var currentUrl = MICHELIN_BASE_URL + "/page-" + i;

		request(currentUrl, function (error, response, html) {

			if (!error && response.statusCode == 200) {

				var $ = cheerio.load(html);

				var result = $('.poi-search-result');

				$('.poi-search-result').find("li:not(.icon-mr)").each(function(i, element){

					var url = $(this).children().find("a").attr("href");
					url = "https://restaurant.michelin.fr" + url;
					urls.push(url);
				});

				requestDone++;

				if(requestDone >= NUMBER_OF_PAGES)
				{		
					console.log(">>"+urls.length+" urls have been fetched.");		
					console.log(">>Launching individual scrapping.");

					Promise.all(urls.map((url) => {
						return new Promise((resolve, reject) => {
							request(url, function (err, resp, body) {
								if (!err)
								{
									let $ = cheerio.load(body);

									var name = $(".poi_intro-description > [itemprop=name]").text().trim();

									var address = $(".street-block > .thoroughfare").first().text().trim();
									var addressNumber = -1;
									try{
										addressNumber = address.match(/\d+/)[0];
									}
									catch(e){}

									var addressStreet = address.replace(addressNumber, "").trim();

									var postcode = $(".locality-block > .postal-code").first().text().trim();
									var locality = $(".locality-block > .locality").first().text().trim();
									var country = $(".country").first().text().trim();

									var image = $(".auto_image_style").first().attr("data-src");//"https://restaurant.michelin.fr/sites/mtpb2c_fr/files/styles/poi_detail_landscape/public/iISK-1u8sxhxOIPA.jpg?itok=0p1IVlLX";

									var priceText = $(".poi_intro-display-prices").first().text().trim().split(" ");

									var minPrice = priceText[3];
									var maxPrice = priceText[6];

									var starsClass = $(".poi_intro-display-guide").find("span").attr("class").split(" ")[2];
									var stars = -1;

									switch(starsClass){
										case "icon-cotation1etoile":
										stars = 1;
										break;
										case "icon-cotation2etoiles":
										stars = 2;
										break;
										case "icon-cotation3etoiles":
										stars = 3;
										break;
										default:
										stars = -1;
										break;
									}

									var data = {
										image : image,
										name : name,
										fourchetteID : "",
										stars : stars,
										price : {
											min : minPrice,
											max : maxPrice
										},
										address : {
											street : addressStreet,
											number : addressNumber,
											country : country,
											postcode : postcode,
											locality : locality
										}
									};
									resolve(data);
								}
								else resolve(null);
				            }); // END REQUEST
				        }); // END PROMISE
				    }))//END MAP
					.then((result) => {
						console.log(">>Inserting "+result.length+" documents in DB.");
						var inserted = 0;
						var insertAttempt = 0;
						result.forEach((obj) => {
							if (obj !== null) {
								Restaurant.create(obj, (err, object) => {
									if (!err) inserted++;

									insertAttempt++;
									if(insertAttempt === result.length){  		
										console.log(">>Inserted "+inserted+"/"+result.length+" documents in DB.");
										scrapLaFourchetteId();
									}
								});
							}
				        });// END FOREACH
				    })//END THEN
					.catch((err) => {
						console.log(err);
						db.close();
				    });//END CATCH	
				}
			}
		});
	}
}

function fetchIDsFromLaFourchette(restaurants)
{
	console.log(">>Fetching IDs from La Fourchette.");

	Promise.all(restaurants.map((restaurant) => {
		return new Promise((resolve, reject) => {
			formattedName = restaurant.name.replace("&","");
			var url = encodeURI(FOURCHETTE_BASE_URL + "name=" + formattedName);

			request({url:url, json:true}, function (err, resp, body) {
				if (!err)
				{
					body.forEach((element) => {
						if(restaurant.address.postcode === element.address.postal_code)
						{
							resolve({
								id : restaurant._id,
								fourchetteID : element.id
							});
						}
					})
					resolve({
						id : restaurant._id,
						fourchetteID : ""
					});
				}
				else {
					resolve({
						id : restaurant._id,
						fourchetteID : ""
					});
				} 
				   }); // END REQUEST

		        }); // END PROMISE
		    }))//END MAP
	.then((result) => {
		updateDatabase(result);

		    })//END THEN
	.catch((err) => {
		console.log(">>Error while retrieving IDs :", err);
		db.close();
		    });//END CATCH	
}

function scrapLaFourchetteId(){
	console.log(">>Starting the Lafourchette ID scrapping.");


	Restaurant.find({}, (err, restaurants) => {

		if(!err)
		{
			fetchIDsFromLaFourchette(restaurants);
		}
		else
		{
			console.log(">>Error while fetching the restaurants from the database");
		}
	});
}

function updateDatabase(results){
	console.log(">>Starting the database updating proccess.");

	var operationsNeeded = results.length - 1;

	Promise.all(results.map((result) => {
		return new Promise((resolve, reject) => {

			Restaurant.findOneAndUpdate({_id : result.id}, {fourchetteID : result.fourchetteID}, {new : true},(err, doc) => {
				if(err) resolve(false);
				else resolve(true);
			});

        }); // END PROMISE
    }))//END MAP
	.then((results) => {

    	//REMOVING ALL DOCS THAT HAVE EMPTY FOURCHETTE ID
    	Restaurant.remove({fourchetteID : ""}, function(err)
    	{
    		if(err) {
    			console.log(">>Error while removing the empty fourchetteID docs", err);
    		} else {
    			console.log(">>All empty fourchetteID docs has been removed.");
    			console.log(">>All the docs have now all their infos complete.");
    		}

    		console.log(">>End of scrapping script.")
    		db.close();
    		console.timeEnd("exec");
    	});

    })//END THEN
	.catch((err) => {
		console.log(">>Error while updating the DB :", err);
		db.close();
    });//END CATCH	

}