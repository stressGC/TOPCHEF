var express = require("express");
var router = express.Router();

var Restaurant = require("./../models/Restaurant");

router.get("/", (request, response) => {
	/*Restaurant.create({name : "SUPER BON RESTO"}, (err, doc) => {
		console.log(err);
		console.log(doc);
	});*/
	Restaurant.find({},(err, docs) => {
		console.log("error find : "+err);
	})
    .then((restaurants => {
		response.render("restaurants/index.html", {restaurants : restaurants});
	}))
});


module.exports = router;