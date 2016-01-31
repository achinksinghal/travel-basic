
$("#beginProcessButton").click(
	function() {
		destination = encodeURIComponent($("#destination").val())
		duration = encodeURIComponent($("#duration").val());
		console.log("Beggining process: destination=>"+ destination +", duration=>"+ duration);
		var request = { destination: destination, duration: duration };
		console.dir(request);
		$.ajax({
		     url: '/trip?destination=' + destination + "&duration=" + duration,
		     	type: "POST",
		     	data: JSON.stringify(request),
		     	dataType: "json",
		     	contentType: "application/json"
		}).done(function (data) {
		     	console.log("Response " + JSON.stringify(data));
				$("body").fadeOut(1000, redirectPage);  
				function redirectPage() {
					window.myObj = {_id: data._id}
			        window.location = '/html/master_layout.html';
			    }
		});
	}
);