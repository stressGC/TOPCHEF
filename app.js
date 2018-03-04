var express = require("express");
var mongoose = require("mongoose");
var nunjucks = require("nunjucks");

mongoose.connect("mongodb://localhost/TOPCHEF");
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

require("./models/Restaurant");
//require("./models/Type");

var app = express();

app.use("/dist", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/css", express.static(__dirname + "/css"));

app.use("/", require("./routes/homepage"));
app.use("/:name", require("./routes/restaurant"));

nunjucks.configure("views", {
	autoescape : true,
	express : app
});

console.log("App lancée sur le port 3000");
app.listen(3000);