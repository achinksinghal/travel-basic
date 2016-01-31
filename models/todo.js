var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({

			content: {
				type: String,
			},

	        trip: {
	            type: mongoose.Schema.Types.ObjectId,
	            ref: "Trip"
	        }
});


var Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;