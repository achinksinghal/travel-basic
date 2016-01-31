var mongoose = require("mongoose");

var tripSchema = new mongoose.Schema({
	destination:{
		type: String,
	},

	numDays: {
		type: Number
	},

	date: {
		type: Date
	},

	days: {
		type: Array
	},

	todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo"
    }]
});


var Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;