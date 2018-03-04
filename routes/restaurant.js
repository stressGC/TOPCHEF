var express = require("express");
var router = express.Router();

var Restaurant = require("./../models/Restaurant");

var restaurantController = require('./../controllers/restaurant.js');

/**/
/*
/* RESTAURANT PAGE
/*
/**/
router.get("/:name", restaurantController.restaurant);


module.exports = router;