var Restaurant = require("./../models/Restaurant");

var homepage =  (request, response) => {

	Restaurant.find({}, (err, docs) => {
		if(err) console.log("error find : "+err);
	})
	.limit(10)
	.skip(20)
    .then((restaurants => {
		response.render("restaurants/list.html", {restaurants : restaurants});
	}))
	.catch((e) => {
		console.log("ERROR : ", e);
	});
};

module.exports = {homepage : homepage};