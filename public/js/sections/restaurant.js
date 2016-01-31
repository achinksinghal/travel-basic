function listRestaurant(cityindex){
	var cityname = $("#city_" + cityindex).html();
	console.log("city=" + cityname);
	$.get("/restaurant?city=" + cityname, function(data){
		restaurants = [];
		for (var i = data.results.length - 1; i >= 0; i--) {
			restaurants.push({
				"name": data.results[i].name, 
				"rating": data.results[i].rating,
				"address": data.results[i].vicinity
			});
		};
		console.log(restaurants);
		data = {"city_name" : cityname, "restaurants" : restaurants};
		loadRestaurantData(data);
	});
}

function loadRestaurantData(restaurantData){
	$.ajax({
        url: '/html/partials/restaurant.html',
        cache: false,
        success: function (source) {
            template = Handlebars.compile(source);
            $('#planner-detail-panel').html(template(restaurantData));
        }
    });  
}