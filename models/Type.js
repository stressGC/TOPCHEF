/*var mongoose = require("mongoose");

var typeSchema = new mongoose.Schema({
	label : String
});

typeSchema.virtual("restaurants", {
	ref: "Restaurant",
	localField : "_id",
	foreignField : "types"
});

var Type = mongoose.model("Type", typeSchema);

module.exports = Type;*/