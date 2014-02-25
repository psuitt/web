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

		htmlBuilder.push("<div>");
		htmlBuilder.push(food.name);
		htmlBuilder.push("</div>");
		
	});

	template.find('#resultsDiv').innerHTML = htmlBuilder.join('');

};
