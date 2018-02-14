var express = require("express");
var router = express.Router();

var Restaurant = require("./../models/Restaurant");

var homepageController = require('./../controllers/homepage.js');

/**/
/*
/* HOMEPAGE
/*
/**/
router.get("/", homepageController.homepage);


module.exports = router;