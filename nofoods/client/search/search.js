Template.search.rendered = function() {
	doSearchFoods();
	doSearchDrinks();
	$('#searchTabs a').click(function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	});
};

var doSearchFoods = function() {
	
	var htmlBuilder = [];

	$('#foodsResults').html("");

	Meteor.subscribe("foods_search", PARAMS.search, function() {
		var results = Foods.find({ });

		results.forEach(function(food) {

			htmlBuilder.push("<tr>");
			htmlBuilder.push("<td class='brand'>");
			htmlBuilder.push(food.brand_view);
			htmlBuilder.push("</td>");
			htmlBuilder.push("<td>");
			htmlBuilder.push("<a href='/food/page/");
			htmlBuilder.push(food._id);
			htmlBuilder.push("' target='_top'>");
			htmlBuilder.push(food.name);
			htmlBuilder.push("</a>");
			htmlBuilder.push("</td>");
			htmlBuilder.push("<td>");
			htmlBuilder.push(food.rating_calc);
			htmlBuilder.push("</td>");
			htmlBuilder.push("</tr>");
		
		});

		$('#foodsResults').html(htmlBuilder.join(''));

	});

};

var doSearchDrinks = function() {
	
	var htmlBuilder = [];

	$('#drinksResults').html("");

	Meteor.subscribe("drinks_search", PARAMS.search, function() {
		var results = Drinks.find({ });

		results.forEach(function(drink) {

			htmlBuilder.push("<tr>");
			htmlBuilder.push("<td class='brand'>");
			htmlBuilder.push(drink.brand_view);
			htmlBuilder.push("</td>");
			htmlBuilder.push("<td>");
			htmlBuilder.push("<a href='/drink/page/");
			htmlBuilder.push(drink._id);
			htmlBuilder.push("' target='_top'>");
			htmlBuilder.push(drink.name);
			htmlBuilder.push("</a>");
			htmlBuilder.push("</td>");
			htmlBuilder.push("<td>");
			htmlBuilder.push(drink.rating_calc);
			htmlBuilder.push("</td>");
			htmlBuilder.push("</tr>");
		
		});

		$('#drinksResults').html(htmlBuilder.join(''));

	});

};
