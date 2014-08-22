var userDataSub,
		currentUser_id;
		
Template.people.destroyed = function () {
	userDataSub && userDataSub.stop();
};		

Template.people.rendered = function() {
	
	userDataSub = Meteor.subscribe('users_searchexact', PARAMS.username, function() {
		// This will contains your user info and the searched.
		var user = Meteor.users.findOne({username: PARAMS.username});
		
		var displayName = user.profile.name ? user.profile.name : user.username;	
		
		$('.people-name').html(displayName);		
		
		findUserRatings(user);
		
		$('span.wishstar').on('click', function() {
			Meteor.call('addToLinks', {username: PARAMS.username});
			$(".wishstar").toggleClass("x100", true);		
		});
		
		loadUserData();
		
		NoFoods.widgetlib.floatMenu($('#people-nav'));
		
	});
	
	$('div.nofoods-pagenav a').click(function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	}); 

};

var loadUserData = function() {

	var user = Meteor.user();

	if (user.profile) {

		if (user.profile.links) {
			for (var i = 0, l = user.profile.links.length; i < l; i += 1) {
				if (user.profile.links[i].username === PARAMS.username) {
					$(".wishstar").toggleClass("x100", true);
					break;
				}
			}
		}

	}

}

var findUserRatings = function(user) {

	currentUser_id = user._id;

	getFoodsPage(1, false, true);
	getDrinksPage(1, false, true);

};

var getFoodsPage = function(page, obj, count) {
	
	var obj = { 
		page: page,
		user_id: currentUser_id 
	};
	
	if (count) 
		obj.count = true;
	
	Meteor.call('getUserFoodRatings', obj, function(err, data) {
		
		if (!err) {
			
			var fDiv = $("#people-foodsList");
			
			fDiv.html("");
			
			for (var i = 0, len = data.ratings.length; i < len; i += 1) {
				var rating = data.ratings[i],
						div = NoFoods.widgetlib.createRatingDiv(rating);
				div.addClass(rating.food_id);
				fDiv.append(div);
			}		
			
			for (var f = 0, len = data.foods.length; f < len; f += 1) {
				var food = data.foods[f];
				$("." + food._id + " .name a").attr('href', NoFoodz.consts.urls.FOOD + food._id).html(food.name);
				$("." + food._id + " .brand a").attr('href', NoFoodz.consts.urls.BRAND + food.brand_id).html(food.brand_view);
			}		
			
			if (len === 0) {
				fDiv.append("No ratings found");			
			}
			
			if (count) {
				$("#people-foods .people-paging").nofoodspaging({
					max: data.count / data.maxPageSize,
					select: getFoodsPage
				});			
			}	
			
		}
		
  });
};

var getDrinksPage = function(page, obj, count) {
	
	var obj = { 
		page: page,
		user_id: currentUser_id 
	};	
	
	if (count) 
		obj.count = true;
	
	Meteor.call('getUserDrinkRatings', obj, function(err, data) {
		
		if (!err) {
			
			var dDiv = $("#people-drinksList");
			
			dDiv.html("");
			
			for (var i = 0, len = data.ratings.length; i < len; i += 1) {
				var rating = data.ratings[i],
						div = NoFoods.widgetlib.createRatingDiv(rating);
				div.addClass(rating.drink_id);
				dDiv.append(div);
			}		
			
			for (var f = 0, len = data.drinks.length; f < len; f += 1) {
				var drink = data.drinks[f];
				$("." + drink._id + " .name a").attr('href', NoFoodz.consts.urls.DRINK + drink._id).html(drink.name);
				$("." + drink._id + " .brand a").attr('href', NoFoodz.consts.urls.BRAND + drink.brand_id).html(drink.brand_view);
			}	
			
			if (len === 0) {
				dDiv.append("No ratings found");			
			}
			
			if (count) {
				$("#people-drinks .people-paging").nofoodspaging({
					max: data.count / data.maxPageSize,
					select: getDrinksPage
				});			
			}			
			
		}
		
  });
	
};