var Restaurant = require("./../models/Restaurant");

const ITEMS_PER_PAGE = 5;

var homepage =  (request, response) => {

	var query = request.query;
	var offset = 0;
	var page = 0;

	if(query.hasOwnProperty("page")){
		page = Number(query.page);
		offset = page * ITEMS_PER_PAGE;
	}
	var max = offset + ITEMS_PER_PAGE;
	console.log("displaying results from "+offset+" to "+ max);

	Restaurant.find({}, (err, docs) => {
		if(err) console.log("error find : "+err);
	})
	.sort({
		stars : -1,
		name : 1
		})	
	.limit(ITEMS_PER_PAGE)
	.skip(offset)
    .then((restaurants) => {
		response.render("restaurants/list.html", 
			{
				restaurants : restaurants,
				page : page,
				previous : page - 1,
				next : page + 1
			});
	})
	.catch((e) => {
		console.log("ERROR : ", e);
		response.send(e);
	});
};

module.exports = {homepage : homepage};