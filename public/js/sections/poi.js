function listPoi(cityindex){
    var cityname = $("#city_" + cityindex).html();
	$.get('/event?city=' + cityname, function(data) {
		var poiData = {"city_name" : cityname,"poi": data.results};
		loadPoi(poiData);
	});
}  

function loadPoi(poiData){
	$.ajax({
        url: '/html/partials/poi.html',
        cache: false,
        success: function (source) {
            template = Handlebars.compile(source);
            $('#planner-detail-panel').html(template(poiData));
        }
    });  
}