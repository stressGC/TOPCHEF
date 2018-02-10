var request = require("request");
var cheerio = require("cheerio");

var count = 1;
var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
var parsedResults = [];
var nb_of_pages = 34;
var requestDone = 0;

for(var i = 0; i < nb_of_pages; i++)
{
	var currentUrl = url+"/page-"+i;

	request(currentUrl, function (error, response, html) {

	  if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);

	    var result = $('.poi-search-result');

	    $('.poi-search-result').find("li:not(.icon-mr)").each(function(i, element){
	    	var title = $(this).children().attr("attr-gtm-title").trim();

	    	var infos = $(this).find(".poi_card-other-info-inside");
	    	var cuisinesString = infos.find(".poi_card-display-cuisines").html().trim();

	    	var cuisines = cuisinesString.split(";");

	    	var data = {
	    		title : title,
	    		cuisines : cuisines
	    	}

	    	parsedResults.push(data);
		});

		requestDone++;
		console.log(requestDone);

		if(requestDone >= nb_of_pages - 1)
		{
			console.log(parsedResults);
		}
	  }
	});
}
