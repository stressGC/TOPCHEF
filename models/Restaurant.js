var mongoose = require("mongoose");

var restaurantSchema = new mongoose.Schema({
	name : String,
	stars : Number,

	price : {
		min : Number,
		max : Number
	}/*,
	types : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Type"
		}
	]*/
});

var Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;