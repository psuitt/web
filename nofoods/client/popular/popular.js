Template.popular.rendered = function() {
	
	Meteor.subscribe('statistics_country', function() {
		
		Statistics.find({}).forEach(function(stat) {
			
			var div = $("<div></div>");
			div.html(stat.country + " Foods and Drinks: " + stat.length);
			$("div.contents").append(div);
			
		});
		
	});

};
