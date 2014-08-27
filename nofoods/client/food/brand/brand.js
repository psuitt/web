Template.brandsTemplate.destroyed = function () {

};

Template.brandsTemplate.rendered = function() {
	
	//setUp();
	
	fetchData();
	
	$('.nofoods-pagenav a').click(function(e) {
		if (!$(this).hasClass('button')) {
			e.preventDefault();
			$(this).tab('show');	
		}
	}); 
	
	NoFoods.widgetlib.floatMenu($('#brands-nav'));
	
};

var fetchData = function() {
	
	var obj = {
		brand_id: PARAMS._id	
	}
	
	Meteor.call('getFoodDrinkByBrand', obj, function(err, data) {
		
		if (!err) {
			
			var brand = data.brand;			
			
			if(!brand)
				Router.go('/404');
		
			$('.brand-name').html(brand.name);
			
			if (brand.flags && brand.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1) 
				$('.button.report').addClass('reported')
													 .html('Reported')
													 .attr('title', 'This item has been reported.');
			
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
					
					link.attr('href', NoFoodz.consts.urls.FOOD + food._id).html(food.name);
					
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
					
					link.attr('href', NoFoodz.consts.urls.DRINK + drink._id).html(drink.name);
					
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

