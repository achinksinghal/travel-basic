var mongoose = require("mongoose");
mongoose.connect( "mongodb://localhost/travel_native");

mongoose.set("debug", true)

module.exports.Trip = require("./trip");
module.exports.Todo = require("./todo");

