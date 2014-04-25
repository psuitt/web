MAP_DATA = {};
var statsSub,
		foodSub;

Template.explore.destroyed = function() {
	statsSub && statsSub.stop();
	foodSub && foodSub.stop();
};

Template.explore.rendered = function() {
	
	setPath();
	
	statsSub = Meteor.subscribe('statistics_country', function() {
		
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
	
	foodSub = Meteor.subscribe('foods_toprated', function() {
		
		Foods.find({}).forEach(function(food) {
			var div = $("<div class='myrating myfoods'></div>");
			var title = $("<span class='name myfoods'><a target='_blank' ></a></span>");
			var brand = $("<span class='brand myfoods'><a target='_blank' ></a></span>");

			title.addClass("lower");									
				
			div.prepend(food.rating_calc);
			div.append(title);
			div.append(brand);

			title.find('a').attr('href', '/food/page/' + food._id).html(food.name);
			brand.find('a').attr('href', '/brand/page/' + food.brand_id).html(food.brand_view);
		
			$('#explore-content').append(div);		
		
		});

	});
		
};

var initMap = function () {
	
	var map = 'world_en';
	
	if (typeof PARAMS != "undefined") {
		if (PARAMS && PARAMS.maptype && PARAMS.maptype.length > 0) {
			map = PARAMS.maptype + '_en';
		}	
	}

	$("#explore-worldmap").vectorMap({
		map: map,
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
			$("#explore-info h4").html(region);
			$("#explore-content").html("");
			MAP_DATA[code.toUpperCase()] && $("#explore-content").html("Total Foods and Drinks: " + MAP_DATA[code.toUpperCase()].numberofitems);
	  }
	});
	
};
