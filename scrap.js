var request = require("request");
var cheerio = require("cheerio");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TOPCHEF');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Restaurant = require("./models/Restaurant");

console.log(">>Launching scrapping script.");

Restaurant.deleteMany({}).then(function (result) {
	console.log(">>All previous documents have been deleted ("+result.n+" docs).");
	launchScrapping();
});

function launchScrapping(){

	var count = 1;
	var baseUrl = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
	var restaurants = [];
	var NumberOfPages = 5;
	var requestDone = 0;

	let urls = [];

	for(var i = 0; i < NumberOfPages; i++)
	{
		var currentUrl = baseUrl+"/page-"+i;

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

				if(requestDone >= NumberOfPages)
				{		
					console.log(">>"+urls.length+" urls have been fetched.");		
					console.log(">>Launching individual scrapping.");
					//urls = urls.slice(0, 10);

					Promise.all(urls.map((url) => {
				        return new Promise((resolve, reject) => {
				            request(url, function (err, resp, body) {
				                if (!err)
				                {
					                let $ = cheerio.load(body);

					                var name = "ISSOUS";
					                var stars = 666;
							    	var minPrice = 1;
							    	var maxPrice = 99;

							    	var data = {
							    		name : name,
							    		stars : stars,
							    		price : {
							    			min : minPrice,
							    			max : maxPrice
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
								        db.close();
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
