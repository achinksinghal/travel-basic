
console.log("planner nav loaded.");

jQuery(document).ready(function ($) { 

	$("#home-master-nav").click(function(){
		console.log("Navigate to main");

		parent.navigateToMainSection('home');
	});

	$("#budget-master-nav").click(function(){
		console.log("Navigate to budget");

		parent.navigateToMainSection('budget');
	});

	$("#todo-master-nav").click(function(){
		console.log("Navigate to todo");

		parent.navigateToMainSection('todo');
	});

	$("#profile-master-nav").click(function(){
		console.log("Navigate to profile");

		window.parent.navigateToMainSection('profile');
	});

	$("#itinerary-master-nav").click(function(){
		console.log("Navigate to itinerary");

		parent.navigateToMainSection('itinerary');

		

	});

});