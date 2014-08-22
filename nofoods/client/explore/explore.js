MAP_DATA = {};
var statsSub,
		activeSub;

Template.explore.destroyed = function() {
	statsSub && statsSub.stop();
	activeSub && activeSub.stop();
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
	
	$('.explore-options').on('click', 'a', menuClick);
	$('.explore-options a').eq(0).click();
		
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
			//$("#explore-info h4").html(region);
			//$("#explore-content").html("");
			//MAP_DATA[code.toUpperCase()] && $("#explore-content").html("Total Foods and Drinks: " + MAP_DATA[code.toUpperCase()].numberofitems);
	  }
	});
	
};

var menuClick = function() {
	
	var self = $(this),
			dataType = self.attr('datatype'),
			sub = self.attr('sub');
	
	var tempScrollTop = $(window).scrollTop();

	$('#explore-content').html('');
	$('.explore-options a').removeClass('selected');
	self.addClass('selected');
	
	if (!dataType || !sub) 
		return;
		
	var collection = false;		
		
	switch(dataType) {
		case 'food':
			collection = Foods;
			break;
		case 'drink':
			collection = Drinks;
			break;
		default:
			return;	
	
	}
	
	var list = $('<ol><ol>');
	
	activeSub = Meteor.subscribe(sub, function() {
		
		collection.find({}).forEach(function(item) {
			var listItem = $("<li></li>");
			var div = $("<div class='myrating myfoods'></div>");
			var title = $("<span class='name myfoods'><a></a></span>");
			var brand = $("<span class='brand myfoods'><a></a></span>");

			title.addClass("lower");									
				
			div.append(title);
			div.append(brand);
			div.append(NoFoods.widgetlib.createHeart(item.rating_calc, item.ratingcount_calc));

			title.find('a').attr('href', NoFoodz.consts.urls[dataType.toUpperCase()] + item._id).html(item.name);
			brand.find('a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);
		
			listItem.append(div);
			list.append(listItem);
					
		});
		
		$('#explore-content').append(list);
		
		$(window).scrollTop(tempScrollTop);
		
		activeSub.stop();

	});

};
