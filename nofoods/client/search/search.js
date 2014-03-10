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

	$('#foodsResults').html("");

	Meteor.subscribe("foods_search", PARAMS.search, function() {
		var results = Foods.find({ });

		results.forEach(function(food) {

			/*
			htmlBuilder.push("<tr>");
			htmlBuilder.push("<td class='brand'>");
			htmlBuilder.push("<a href='/brand/page/");
			htmlBuilder.push(food.brand_id);
			htmlBuilder.push("' target='_top'>");
			htmlBuilder.push(food.brand_view);
			htmlBuilder.push("</a>");
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
			*/
		
			$('#foods').append(getSearchRow('/food/page/', food));	
			

		});

		window.parent.recalcFrame($('#foods').outerHeight());	
		//$('#foodsResults').html(htmlBuilder.join(''));

	});

};

var doSearchDrinks = function() {
	
	var htmlBuilder = [];

	$('#drinksResults').html("");

	Meteor.subscribe("drinks_search", PARAMS.search, function() {
		var results = Drinks.find({ });

		results.forEach(function(drink) {

			/*
			htmlBuilder.push("<tr>");
			htmlBuilder.push("<td class='brand'>");
			htmlBuilder.push("<a href='/brand/page/");
			htmlBuilder.push(drink.brand_id);
			htmlBuilder.push("' target='_top'>");
			htmlBuilder.push(drink.brand_view);
			htmlBuilder.push("</a>");
			htmlBuilder.push("</td>");
			htmlBuilder.push("<td>");
			htmlBuilder.push("<a href='/drink/page/");
			htmlBuilder.push(drink._id);
			htmlBuilder.push("' target='_top'>");
			htmlBuilder.push(drink.name);
			htmlBuilder.push("</a>");
			htmlBuilder.push("</td>");
			htmlBuilder.push("<td>");
			htmlBuilder.push(drink.rating_calc);
			htmlBuilder.push("</td>");
			htmlBuilder.push("</tr>");
			*/
			$('#drinks').append(getSearchRow('/drink/page/', drink));	

		});

		window.parent.recalcFrame($('#drinks').outerHeight());
		//$('#drinksResults').html(htmlBuilder.join(''));

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

	rating.html(item.rating_calc)
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
