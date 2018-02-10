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
	var baseUrl = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
	var restaurants = [];
	var NumberOfPages = 3;
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
			    	url = "https://restaurants.michelin.fr" + url;
			    	urls.push(url);
				});

				requestDone++;

				if(requestDone >= NumberOfPages)
				{		
					console.log("All "+urls.length+" urls have been fetched.");		
					console.log("Launching individual scrapping on 10 urls.");
					urls = urls.slice(0, 10);
					var debug = 0;

					Promise.all(urls.map((url) => {
						console.log("Launching promises.");
				        return new Promise((resolve, reject) => {
				            request(url, function (err, resp, body) {
				            	console.log("Request launched to url :"+url);
				                if (err) {
				                	console.log("error on "+url);
				                	console.log(err);
				                	return reject(err);
				                }

				                let $ = cheerio.load(body);

				                var name = "ISSOUS"
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
						    	debug++;
						    	console.log(debug);
				                resolve(data);
				            }); // END REQUEST
				        }); // END PROMISE
				    }))//END MAP
				    .then((result) => {
				    	console.log("results are here : #############################");
				        result.forEach(function (obj) {
				            if (obj.name == null) {
				                console.log(obj.url, "returned null");
				            } else {
				                console.log(obj);
				            }
				        });// END FOREACH
				    })//END THEN
				    .catch((err) =>{
				        console.log(err);
				        db.close();
				    });//END CATCH	
				}
		  	}
		});
	}
}
