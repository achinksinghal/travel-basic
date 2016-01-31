function listHotel(cityindex){
	var cityname = $("#city_" + cityindex).html();
	console.log("City name=>"+ cityname);
	$.ajax({
	        url: '/hotel?city='+ cityname,
	        cache: true,
	     	type: "GET"
	     }).done(function (data) {
			var hotels = [];
			for (var i in data.results) {
				hotels.push({
					"name": data.results[i].name, 
					"rating": data.results[i].rating,
					"address": data.results[i].vicinity
					});
		};
		hotelData = {"city_name" : cityname, "hotels" : hotels};
		loadHotelData(hotelData);
	});
}

function loadHotelData(hotelData){
	$.ajax({
        url: '/html/partials/hotel.html',
        cache: false,
        success: function (source) {
            template = Handlebars.compile(source);
            $('#planner-detail-panel').html(template(hotelData));
        }
    });  
}