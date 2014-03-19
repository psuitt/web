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
