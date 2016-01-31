var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require("./models"),	
    methodOverride = require("method-override"),
    morgan = require("morgan"),
    request = require('request')

app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));

function getLatLong(address, callback){
	request("https://maps.googleapis.com/maps/api/geocode/json?address=" + address, function (error, response, body) {
		if (error) {
			console.log("Error!  Request failed - " + error);
		} else if (!error && response.statusCode === 200) {
			var parsedBody = JSON.parse(body);
			var lat = parsedBody.results[0].geometry.location.lat;
			var long = parsedBody.results[0].geometry.location.lng;
			callback(lat,long);
		}
	})
}

function getEvents(lat,long, callback){
	request("http://places.cit.api.here.com/places/v1/discover/explore?at="+lat+","+long+"&app_id=QpN79pgeHYdwTAJrs8ai&app_code=C4Cl-sWzJz1v6zCkf9jd7w&tf=plain&pretty=true", function (error, response, body){
		if (error) {
			console.log("Error!  Request failed - " + error);
		} else if (!error && response.statusCode === 200) {
			callback(body);
		}
	})
}

function getNearBy(lat,long,type,radius,callback){
	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + long + '&radius='+(radius*1000)+'&types='+type+'&key=AIzaSyCpVPQhvDdumU0QmzZ7u-H64F6B2FgtoQI', function (error, response, body) {
		if (error) {
			console.log("Error!  Request failed - " + error);
		} else if (!error && response.statusCode === 200) {
		        	callback(body)
		   
		}
	});
	
}

function computeFlags(trip){
	for(var i = 0; i < trip.days.length; i++){
	 	var d = trip.days[i];	
		
		for(var n = 0; n < d.events.length; n++){
			var e = d.events[n];
			
			if(e.type='restaurant'){d.restaurantFlag = true}
			if(e.type='hotel'){d.hotelFlag = true}
		}
	}
	return trip;
}


app.post('/trip', function(req, res) {
	console.log(req.query)
	// req.body.duration = 3;
	// req.body.destination = "Scotland"
	var days = [];
	var numDays = req.query.duration
	var destination = req.query.destination
	for (var i = 0; i < parseInt(numDays); i++) {
		days.push({index: i});
	};
	var trip = new db.Trip({days: days, numDays: numDays, destination: destination})

	trip.save(function(err) {
		if (err) {
			console.log("An error has occured.")
		} else {
			res.format({
		        'application/json': function(){
		        	res.send(trip);
		        }
		    });
		};
	})
});

app.put('/trip/:id/day/:day/city', function(req, res) {
	db.Trip.findById(req.params.id, function(err, trip){
		trip.days[parseInt(req.params.day) - 1].city = req.body.city
		trip.save(function(err, trip){
			if (err) {
				console.log(err)
			} else {
				res.format({
			        'application/json': function(){
			        	res.send(computeFlags(trip));
			        }
			    });	
			};
		})
	})
})

app.put('/trip/:id/day/:day/event', function(req, res) {
	res.format({
        'application/json': function(){
        	res.send('{"status": "success", "id": "'+req.params.id+'", "day": "'+req.params.day+'"}');
        }
    });	
})




app.get('/trip/:id', function(req, res){
	db.Trip.findById(req.params.id, function(err, trip){
		if (err) {
			console.log(err)
		} else {
			res.format({
		        'application/json': function(){
		        	res.send(trip);
		        }
		    });	
		};
	})
});



app.get('/sfafasasdasdasdas', function(req, res) {

	// Address will be 
	var address = 'Tracy, CA'
	// find lat and long of city
	request("https://maps.googleapis.com/maps/api/geocode/json?address=" + address, function (error, response, body) {
		if (error) {
			console.log("Error!  Request failed - " + error);
		} else if (!error && response.statusCode === 200) {
			var parsedBody = JSON.parse(body)
			var lat = parsedBody.results[0].geometry.location.lat
			var long = parsedBody.results[0].geometry.location.lng
			// find hotels in that city
			request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + long + '&radius=1000&types=lodging&key=AIzaSyCpVPQhvDdumU0QmzZ7u-H64F6B2FgtoQI', function (error, response, body) {
				if (error) {
					console.log("Error!  Request failed - " + error);
				} else if (!error && response.statusCode === 200) {
					res.format({
				        'application/json': function(){
				        	res.send(body)
				        }
				    });
				}
			});
		}

	
	});
});

app.put('/trip/:id', function(req, res){

	var trip = new db.Trip (req.body) // maybe need to be more specific

	trip.save(function(err, trip) {
		if (err) {
			console.log("An error has occured.")
		} else {
			res.format({
		        'application/json': function(){
		        	res.send(trip)
		        }
		    });
		};
	})


	// res.format({
	// 	'application/json': function(){
	// 	  res.send({ message: "Hello World!" });
	// 	}
	// })
});

app.get('/trip/:id/todos', function(req, res){
	console.log(req.params.id)
	db.Trip.findById(req.params.id)
		.populate("todos")
		.exec(function(err, trip) {
			// console.log("hello")
			if (err) {console.log(err)};
			res.format({
				'application/json': function(){
					console.log(trip)
					res.send(trip);
				}
			});
		});
});

app.get('/event', function(req, res){
	res.format({
		'application/json': function(){
			getLatLong(req.query.city, function(lat, long){
				getEvents(lat,long, function(body){
					res.send(body);
				});
			});
		}
	});
});

app.get('/hotel', function(req, res){
	res.format({
		'application/json': function(){
			getLatLong(req.query.city, function(lat, long){
				getNearBy(lat,long,'lodging', 20, function(body){
					res.send(body);
				});
			});
		}
	});
});

app.get('/restaurant', function(req, res){
	res.format({
		'application/json': function(){
			getLatLong(req.query.city, function(lat, long){
				getNearBy(lat,long,'restaurant', 20, function(body){
					res.send(body);
				});
			});
		}
	});
});

app.get('/poi', function(req, res){
	res.format({
		'application/json': function(){
			getLatLong(req.query.city, function(lat, long){
				getNearBy(lat,long,'point_of_interest', 20, function(body){
					res.send(body);
				});
			});
		}
	});
});



app.get('/budget/:id', function(req, res){
	db.Budget.findById(req.params.id, function(err, budget){
		res.format(
			{'application/json': function(){
				res.send(budget);
			 }
		});	
	});
});



app.use(express.static(__dirname+'/public'));

app.listen(3000, function() {
  console.log("Server running on port 3000")
})
