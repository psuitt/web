MAP_DATA = {};

Template.popular.rendered = function() {
	
	Meteor.subscribe('statistics_country', function() {
		
		Statistics.find({}).forEach(function(stat) {
			
			var div = $("<div></div>");
			div.html(stat.country + " Foods and Drinks: " + stat.length);
			$("div.contents").append(div);
			
			MAP_DATA[stat.countrycode] = {
				numberofitems: stat.length		
			};
			
		});
		
	});
	
	initMap();
		
};

var initMap = function () {
	
	$("#popular-worldmap").vectorMap({
		map: 'world_en',
		backgroundColor: '#a5bfdd',
		borderColor: '#818181',
		borderOpacity: 0.25,
		borderWidth: 1,
		color: '#f4f3f0',
		enableZoom: true,
		hoverColor: '#c9dfaf',
		hoverOpacity: null,
		normalizeFunction: 'linear',
		scaleColors: ['#b6d6ff', '#005ace'],
		selectedColor: '#c9dfaf',
		selectedRegion: null,
		showTooltip: true,
	  onLabelShow: function(element, label, code) {
	  	if (MAP_DATA[code.toUpperCase()]) {
	  		label.append("</br>Foods and Drinks: " + MAP_DATA[code.toUpperCase()].numberofitems);
	  	}
	  },
		onRegionClick: function(element, code, region) {
			var message = 'You clicked "'
	            + region 
	            + '" which has the code: '
	            + code.toUpperCase();
             
	        alert(message);
	  }
	});
	
};
