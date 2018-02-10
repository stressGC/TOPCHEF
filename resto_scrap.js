var request = require("request");
var cheerio = require("cheerio");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TOPCHEF');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Restaurant = require("./models/Restaurant");

launchScrapping();

function launchScrapping(){

	var count = 1;
	var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
	var restaurants = [];
	var NumberOfPages = 34;
	var requestDone = 0;

	for(var i = 0; i < NumberOfPages; i++)
	{
		var currentUrl = url+"/page-"+i;

		request(currentUrl, function (error, response, html) {

		  	if (!error && response.statusCode == 200) {

			    var $ = cheerio.load(html);

			    var result = $('.poi-search-result');

			    $('.poi-search-result').find("li:not(.icon-mr)").each(function(i, element){

			    	var title = $(this).children().attr("attr-gtm-title").trim();

			    	var infos = $(this).find(".poi_card-other-info-inside");

			    	var url = $(this).children().find("a").attr("href");
			    	url = "https://restaurants.michelin.fr" + url;
			    	console.log(url);
			    	/*var cuisinesString = infos.find(".poi_card-display-cuisines").html().trim();

			    	var cuisines = cuisinesString.replace("&#xE9;", "é");
			    	cuisines = cuisines.split(";");*/

			    	var stars = 0;
			    	var minPrice = 1;
			    	var maxPrice = 99;

			    	var data = {
			    		name : title,
			    		stars : stars,
			    		price : {
			    			min : minPrice,
			    			max : maxPrice
			    		}
			    		//cuisines : cuisines
			    	}

			    	restaurants.push(data);
				});

				requestDone++;

				if(requestDone >= NumberOfPages)
				{		
					Restaurant.deleteMany({})
					.then(function (result) {
						console.log(result.n+" documents deleted.");

						Restaurant.collection.insert(restaurants, function (err, docs) {
							if (err) { 
							  console.log("Error while inserting data : "+err);
							} else {
								console.log("Inserted "+docs.insertedCount+" documents to the Collection.");
							}
							db.close();
						});
					});
				}
		  	}
		});
	}
}
