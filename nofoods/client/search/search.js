var foodResults = false,
		drinkResults = false,
		
		MAX_RESULTS = 3,
		foodsPaging,
		drinksPaging;

Template.search.rendered = function() {
	
	if (typeof PARAMS !== 'undefined')
		DoSearch(PARAMS.type, PARAMS.search);	
	
	$('#searchTabs a').on('click', function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	});
	
};

DoSearch = function(type, search) {
	
	switch(type) {
		case "food":
			$('#search-peoplelink').toggle(false);
			$('#search-people').toggle(false);
			doSearchFoods(search);
			doSearchDrinks(search);
			break;
		case "people":
			$('#search-foodslink').toggle(false);
			$('#search-foods').toggle(false);
			$('#search-drinkslink').toggle(false);
			$('#search-drinks').toggle(false);
			$('#searchTabs li').removeClass('active');
			$('#searchTabsContent div').removeClass('active');
			$('#search-peoplelink').parent().addClass('active');
			$('#search-people').addClass('active');
			doSearchPeople(search);
			break;
		default:
			Router.go('/404');
			break;
	}

};

var doSearchPeople = function(search) {
	
	var htmlBuilder = [];

	$('#search-people').html("");

	Meteor.subscribe("users_search", search, function() {
		var results = Meteor.users.find({ }),
				count = results.count() - 1,
				user_id = Meteor.userId();

		if (count < 1) {

			$('#search-people').html("<div class='resultsTotals'>No results found</div>");

		} else {
			
			if (count < 19) {
				$('#search-peoplelink').html("People (" + count + ")");
			} else {
				$('#search-peoplelink').html("People (20+)");
			}

			$('#search-people').html("<div class='resultsTotals'>" + count + " results found</div>");

			results.forEach(function(user) {
				var div = $('<div></div>'),
						//icon = $('<span>NO IMAGE AVAILABLE</span>'),
						name = $('<span></span>'),
						aName = $("<a target='_top'></a>");

						div.addClass('item');
						//icon.addClass('itemIcon');
						name.addClass('itemName');
						
						aName.attr('href', '/people/page/' + user.username);
						aName.html(user.username);

						name.append(aName);	
						//div.append(icon);
						div.append(name);
				user_id !== user._id && $('#search-people').append(div);	
			});

		}

		$('div.loading').addClass('hide');	
		$('#resultsDiv').show();

	});

};

var doSearchFoods = function(search) {
	
	$('#search-foods div.search-results').html("");
	
	if (!search) {
		return;
	}
	
	var obj = {
		'search': search
	};
	
	Meteor.call('foodSearch', obj, function(err, response) {
		
		if (!err) {
			
			if (response.data) {
			
				var count = response.data.length;
				
				foodResults = response.data;
			
				if (count < 99) {
					$('#search-foodslink').html("Foods (" + count + ")");
				} else {
					$('#search-foodslink').html("Foods (100+)");
				}
		
				if (count === 0) {
		
					$('#search-foods div.search-results').html("<div class='resultsTotals'>No results found</div>");
		
				} else {
		
					getFoodsPage(1);
					
					if (foodsPaging) 
						foodsPaging.remove();					
					
					$('#search-foods').append("<div class='search-paging'></div>");
					foodsPaging = $('#search-foods .search-paging').nofoodspaging({
						max: foodResults.length / MAX_RESULTS,
						select: getFoodsPage
					});
		
				}
			
			}		
			
		}
		
		$('div.loading').addClass('hide');
		$('#resultsDiv').show();
		
  });
};

var getFoodsPage = function(page) {

	var offset = MAX_RESULTS*(page-1),
			offsetMax = MAX_RESULTS*(page);	
			
	var len = foodResults.length;
	
	$('#search-foods div.search-results').html("<div class='resultsTotals'>" + len + " results found</div>");
	
	if (len > offsetMax) {
		len = offsetMax;
	}
			
	for (var i = offset; i < len; i += 1) {
		var food = foodResults[i];
		$('#search-foods div.search-results').append(getSearchRow('/food/page/', food));	
	}				
		
};

var doSearchDrinks = function(search) {
	
	$('#search-drinks div.search-results').html("");
	
	if (!search) {
		return;
	}
	
	var obj = {
		'search': search
	};
	
	Meteor.call('drinkSearch', obj, function(err, response) {
		
		if (!err) {
			
			if (response.data) {
			
				var count = response.data.length;
				
				drinkResults = response.data;
			
				if (count < 99) {
					$('#search-drinkslink').html("Drinks (" + count + ")");
				} else {
					$('#search-drinkslink').html("Drinks (100+)");
				}
		
				if (count === 0) {
		
					$('#search-drinks div.search-results').html("<div class='resultsTotals'>No results found</div>");
		
				} else {
		
					getDrinksPage(1);
					
					if (drinksPaging)
						drinksPaging.remove();
					
					$('#search-drinks').append("<div class='search-paging'></div>");
					drinksPaging = $('#search-drinks .search-paging').nofoodspaging({
						max: drinkResults.length / MAX_RESULTS,
						select: getDrinksPage
					});	
		
				}
			
			}		
			
		}
		
		$('div.loading').addClass('hide');	
		$('#resultsDiv').show();
		
  });
};

var getDrinksPage = function(page) {

	var offset = MAX_RESULTS*(page-1),
			offsetMax = MAX_RESULTS*(page);	
			
	var len = drinkResults.length;
	
	$('#search-drinks div.search-results').html("<div class='resultsTotals'>" + len + " results found</div>");
	
	if (len > offsetMax) {
		len = offsetMax;
	}
			
	for (var i = offset; i < len; i += 1) {
		var drink = drinkResults[i];
		$('#search-drinks div.search-results').append(getSearchRow('/drink/page/', drink));	
	}					
		
};

var getSearchRow = function(link, item) {
	var div = $('<div></div>'),
			icon = $('<span>NO IMAGE AVAILABLE</span>'),
			name = $('<span></span>'),
			brand = $('<span></span>'),
			rating = $('<span></span>'),
			aName = $("<a target='_top'></a>"),
			aBrand = $("<a class='brand' target='_top'></a>");

	div.addClass('item');
	icon.addClass('itemIcon');
	name.addClass('itemName');
	brand.addClass('itemBrand');
	rating.addClass('itemRating');

	aName.attr('href', link + item._id);
	aName.html(item.name);

	aBrand.attr('href', '/brand/page/' + item.brand_id);
	aBrand.html(item.brand_view);

	rating.attr("title", item.rating_calc)
	var i = (Math.round((item.rating_calc * 2))*10).toString();
			
	rating.addClass('rating');
	rating.addClass("x"+i);

	name.append(aName);	
	brand.append(aBrand);
	name.append(brand);
	div.append(icon);
	div.append(name);
	div.append(rating);
	
	return div;

};
