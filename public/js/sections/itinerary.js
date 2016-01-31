loadItinerary();

function loadItinerary(){
	var intinerary = {"dates" : [
        {
            "date_format" : "Monday, Feburary 1",
            "city_name": "Modesto"
        },{
            "date_format" : "Tuesday, February 2",
            "city_name": "Modesto"
        },{
            "date_format" : "Wednesday, February 3", 
            "city_name": "Modesto"
        }]};

	$.ajax({
        url: '/html/partials/itinerary-detail.html',
        cache: false,
        success: function (source) {
            template = Handlebars.compile(source);
            $('#itinerary-list-panel').html(template(intinerary));

        }
    });  
}