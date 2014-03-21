Template.search.rendered = function() {

	switch(PARAMS.type ) {
		case "food":
			$('#search-peoplelink').toggle(false);
			$('#search-people').toggle(false);
			doSearchFoods();
			doSearchDrinks();
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
			doSearchPeople();
			break;
		default:
			Router.go('/404');
			break;
	}
	
	$('#searchTabs a').click(function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	});
};

var doSearchPeople = function() {
	
	var htmlBuilder = [];

	$('#search-people').html("");

	Meteor.subscribe("users_search", PARAMS.search, function() {
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
						icon = $('<span>NO IMAGE AVAILABLE</span>'),
						name = $('<span></span>'),
						aName = $("<a target='_top'></a>");

						div.addClass('item');
						icon.addClass('itemIcon');
						name.addClass('itemName');
						
						aName.attr('href', '/people/page/' + user.username);
						aName.html(user.username);

						name.append(aName);	
						div.append(icon);
						div.append(name);
				user_id !== user._id && $('#search-people').append(div);	
			});

		}

		window.parent.recalcFrame($('#resultsDiv').outerHeight());	

	});

};

var doSearchFoods = function() {
	
	var htmlBuilder = [];

	$('#search-foods').html("");

	Meteor.subscribe("foods_search", PARAMS.search, function() {
		var results = Foods.find({ }),
				count = results.count();

		if (count < 99) {
			$('#search-foodslink').html("Foods (" + count + ")");
		} else {
			$('#search-foodslink').html("Foods (100+)");
		}

		if (count === 0) {

			$('#search-foods').html("<div class='resultsTotals'>No results found</div>");

		} else {

			$('#search-foods').html("<div class='resultsTotals'>" + count + " results found</div>");

			results.forEach(function(food) {
				$('#search-foods').append(getSearchRow('/food/page/', food));	
			});

		}

		window.parent.recalcFrame($('#resultsDiv').outerHeight());	

	});

};

var doSearchDrinks = function() {
	
	var htmlBuilder = [];

	$('#search-drinks').html("");

	Meteor.subscribe("drinks_search", PARAMS.search, function() {
		var results = Drinks.find({ })
				count = results.count();

		if (count < 99) {
			$('#search-drinkslink').html("Drinks (" + count + ")");
		} else {
			$('#search-drinkslink').html("Drinks (100+)");
		}

		if (count === 0) {
			$('#search-drinks').html("<div class='resultsTotals'>No results found</div>");			
		} else {
			$('#search-drinks').html("<div class='resultsTotals'>" + count + " results found</div>");
			results.forEach(function(drink) {
				$('#search-drinks').append(getSearchRow('/drink/page/', drink));	
			});

		}

		window.parent.recalcFrame($('#resultsDiv').outerHeight());

	});

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
