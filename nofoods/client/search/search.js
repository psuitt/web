Template.search.rendered = function() {
	doSearch();
};

var doSearch = function() {
	
	var htmlBuilder = [];

	$('#results').html("");

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

		$('#results').html(htmlBuilder.join(''));

	});

};
