var brandSub;

Template.brandsTemplate.destroyed = function () {
	brandSub.stop();
};

Template.brandsTemplate.rendered = function() {
	
	brandSub = Meteor.subscribe('brands_item', PARAMS._id, function() {
		done();
	});
	
	$('.nofoods-pagenav a').click(function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	}); 
	
};

var done = function() {
	// This can sometime contain more data if froming from another page.
	var brand = Brands.findOne({_id : PARAMS._id});

	if(!brand)
		Router.go('/404');

	$('.brand').html(brand.name);

	Meteor.subscribe('foods_brand', brand._id, function() {
		var foodRating = 0,
				foodTotal = 0;

		$("#brand-foodsList").html("");	
		$('.brand-foodtotalrating').html(""); 

		Foods.find({}).forEach(function(food) {
			var div = $("<div></div>"),
					link = $("<a target='_blank' ></a>");
			
			link.attr('href', '/food/page/' + food._id).html(food.name);
			
			div.append(link);			
			
			$("#brand-foodsList").append(div);
			foodRating += food.rating_calc;
			foodTotal += 1;
		});
		foodRating > 0 && $('.brand-foodtotalrating').html((foodRating/parseFloat(foodTotal)).toFixed(2));
	}); 	

	Meteor.subscribe('drinks_brand', brand._id, function() {
		var drinkRating = 0,
				drinkTotal = 0;

		$("#brand-drinksList").html("");
		$('.brand-drinktotalrating').html("");

		Drinks.find({}).forEach(function(drink) {
			var div = $("<div></div>"),
					link = $("<a target='_blank' ></a>");
			
			link.attr('href', '/drink/page/' + drink._id).html(drink.name);
			
			div.append(link);
			
			$("#brand-drinksList").append(div);
			drinkRating += drink.rating_calc;
			drinkTotal += 1;
		});
		drinkRating > 0 &&	$('.brand-drinktotalrating').html((drinkRating/parseFloat(drinkTotal)).toFixed(2));
	}); 	

};

