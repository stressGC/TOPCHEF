var mongoose = require("mongoose");

var restaurantSchema = new mongoose.Schema({
	name : String,
	fourchetteID : Number,
	stars : Number,
	image : String,
	price : {
		min : Number,
		max : Number
	},
	address : {
		street : String,
		number : Number,
		country : String,
		postcode : String,
		locality : String
	},
	promotions : []

	/*,
	types : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Type"
		}
	]*/
});

var Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;