(function() {
	Template.home.events = {
		'keypress #search': function(evt, template) {
			if (evt.which == 13) {
				doSearch(evt.target.value, template);		
			}
		}
	};
})();

var doSearch = function(searchVal, template) {
	
	var htmlBuilder = [];
	var results = Foods.find({ name: {$regex: ".*"+searchVal+".*"} });

	results.forEach(function(food) {

		htmlBuilder.push("<tr>");
		htmlBuilder.push("<td class='brand'>");
		htmlBuilder.push("TBA");
		htmlBuilder.push("</td>");
		htmlBuilder.push("<td>");
		htmlBuilder.push("<a href='food/page/");
		htmlBuilder.push(food._id);
		htmlBuilder.push("'>");
		htmlBuilder.push(food.name);
		htmlBuilder.push("</a>");
		htmlBuilder.push("</td>");
		htmlBuilder.push("<td>");
		htmlBuilder.push(food.rating_calc);
		htmlBuilder.push("</td>");
		htmlBuilder.push("</tr>");
		
	});

	template.find('#results').innerHTML = htmlBuilder.join('');

};
