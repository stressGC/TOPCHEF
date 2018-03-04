var Restaurant = require("./../models/Restaurant");
var request = require("request");

const ITEMS_PER_PAGE = 12;
const LA_FOURCHETTE_API_URL = "https://m.lafourchette.com/api/restaurant/";

var homepage =  (req, response) => {

	var query = req.query;
	var offset = 0;
	var page = 0;

	var sort = { 
				stars : -1,
				name : 1
			}

	if(query.hasOwnProperty("sort")){

		sort = query.sort;
	}

	if(query.hasOwnProperty("page")){
		page = Number(query.page);

		if(page >= 0) offset = page * ITEMS_PER_PAGE;
	}
	var max = offset + ITEMS_PER_PAGE;

	console.log(sort);

	Restaurant.find({}, (err, docs) => {
		if(err) console.log("error find : "+err);
	})
	.sort(sort)	
	.limit(ITEMS_PER_PAGE)
	.skip(offset)
    .then((restaurants) => {

    	var ids = [];
    	restaurants.forEach(function(elem){
    		ids.push(elem.fourchetteID);
    	});

    	Promise.all(ids.map((id) => {
				return new Promise((resolve, reject) => {
					var url = LA_FOURCHETTE_API_URL + id + "/sale-type";
					request({url : url, json : true}, (err, resp, body) => {
						var promotions = [];
						if (!err){
							body.forEach((element) => {
								if(element.is_special_offer){
									promotions.push(element);
								}
							});

							resolve({promotions : promotions, fourchetteID : id});
						}
						else resolve(null);
					});
				});
			}))
    		.then((results) => {

    			results.forEach((elem) => {
    				if(elem.promotions.length > 0){
    					restaurants.forEach((restaurant) => {
    						if(elem.fourchetteID === restaurant.fourchetteID){
    							restaurant.promotions = elem.promotions;
    						}
    					})
    				}
    			});

				response.render("restaurants/list.html", 
								{
									restaurants : restaurants,
									page : page,
									previous : page - 1,
									next : page + 1,
									request : "sort="+sort
								});
    		})
    		.catch((e) => {
    			console.log(e);
    		});

	})
	.catch((e) => {
		console.log("ERROR : ", e);
		response.send(e);
	});
};

module.exports = {homepage : homepage};