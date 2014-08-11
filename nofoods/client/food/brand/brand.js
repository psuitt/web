var brandSub;

Template.brandsTemplate.destroyed = function () {
	brandSub && brandSub.stop();
};

Template.brandsTemplate.rendered = function() {
	
	//setUp();
	
	brandSub = Meteor.subscribe('brands_item', PARAMS._id, function() {
		done();
	});
	
	$('.nofoods-pagenav a').click(function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	}); 
	
	NoFoods.widgetlib.floatMenu($('#brands-nav'));
	
};

var done = function() {
	// This can sometime contain more data if froming from another page.
	var brand = Brands.findOne({_id : PARAMS._id});

	if(!brand)
		Router.go('/404');

	$('.brand-name').html(brand.name);
	
	var obj = {
		brand_id: PARAMS._id	
	}
	
	Meteor.call('getFoodDrinkByBrand', obj, function(err, data) {
		
		if (!err) {
			
			var foodRating = 0,
					foodTotal = 0;

			$("#brand-foodsList").html("");	
			$('.brand-foodtotalrating').html(""); 
			
			var drinkRating = 0,
					drinkTotal = 0;
	
			$("#brand-drinksList").html("");
			$('.brand-drinktotalrating').html("");
			
			if (data.foods) {
				for (var i = 0, len = data.foods.length; i < len; i += 1) {
					
					var food = data.foods[i],
							div = $("<div></div>"),
							link = $("<a target='_blank' ></a>");
					
					link.attr('href', '/food/page/' + food._id).html(food.name);
					
					div.append(link);			
					
					$("#brand-foodsList").append(div);
					foodRating += parseInt(food.rating_calc, 10);
					foodTotal += 1;				
				
				}
			}
			
			if (data.drinks) {
				
				for (var i = 0, len = data.drinks.length; i < len; i += 1) {
					
					var drink = data.drinks[i],
							div = $("<div></div>"),
							link = $("<a target='_blank' ></a>");
					
					link.attr('href', '/drink/page/' + drink._id).html(drink.name);
					
					div.append(link);
					
					$("#brand-drinksList").append(div);
					drinkRating += parseInt(drink.rating_calc, 10);
					drinkTotal += 1;
					
				}
			
			}
			
			foodRating > 0 && $('.brand-foodtotalrating').html((foodRating/parseFloat(foodTotal)).toFixed(2));
			drinkRating > 0 &&	$('.brand-drinktotalrating').html((drinkRating/parseFloat(drinkTotal)).toFixed(2));			
			
		}
		
	}); 	

};

