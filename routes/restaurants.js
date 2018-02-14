var express = require("express");
var router = express.Router();

var Restaurant = require("./../models/Restaurant");

router.get("/", (request, response) => {
	Restaurant.find({}, (err, docs) => {
		if(err) console.log("error find : "+err);
	})
    .then((restaurants => {
		response.render("restaurants/list.html", {restaurants : restaurants});
	}))
	.catch((e) => {
		console.log("ERROR : ", e);
	})
});


module.exports = router;