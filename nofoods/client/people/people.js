var userDataSub,
		ratingSub;
		
Template.people.destroyed = function () {
	userDataSub && userDataSub.stop();
	ratingSub && ratingSub.stop();
};		

Template.people.rendered = function() {
	
	userDataSub = Meteor.subscribe('users_searchexact', PARAMS.username, function() {
		// This will contains your user info and the searched.
		var user = Meteor.users.findOne({username: PARAMS.username});
		
		var displayName = user.profile.name ? user.profile.name : user.username;	
		
		$('#people-name').html(displayName);		
		
		findUserRatings(user);
		
		$('span.wishstar').on('click', function() {
			Meteor.call('addToLinks', {username: PARAMS.username});
			$(".wishstar").toggleClass("x100", true);		
		});
		
		loadUserData();
		
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

	ratingSub = Meteor.subscribe('ratings_user', user._id, function() {
		var food_ids = [],
				drink_ids = [],
				fDiv = $("#people-foodsList"),
				dDiv = $("#people-drinksList");

		fDiv.html("");
		dDiv.html("");

		Ratings.find({}).forEach(function(rating) {
			
			if (rating.food_id) {
				food_ids.push(rating.food_id);
			} else {
				drink_ids.push(rating.drink_id);
			}

		});
		
		$("#people-foods").append(NoFoods.lib.createPagingDiv(food_ids.length / 2, getFoodsPage, user._id));
		$("#people-drinks").append(NoFoods.lib.createPagingDiv(drink_ids.length / 2, getDrinksPage,  user._id));

		getFoodsPage(1);
		getDrinksPage(1);

		if (food_ids.length !== 0 || drink_ids.length !== 0) {
			if (food_ids.length === 0) {
				fDiv.append("No ratings found");
			} else if (drink_ids.length === 0) {
				dDiv.append("No ratings found");
			}
		} else {
			fDiv.append("No ratings found");
			dDiv.append("No ratings found");
		}

	}); 

};

var getFoodsPage = function(page, _id) {
	
	var obj = { 
		page: page,
		user_id: _id
	};
	
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
				$("." + food._id + " .name a").attr('href', '/food/page/' + food._id).html(food.name);
				$("." + food._id + " .brand a").attr('href', '/brand/page/' + food.brand_id).html(food.brand_view);
			}			
			
		}
		
  });
};

var getDrinksPage = function(page, _id) {

	var obj = { 
		page: page,
		user_id: _id
	};	
	
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
				$("." + drink._id + " .name a").attr('href', '/drink/page/' + drink._id).html(drink.name);
				$("." + drink._id + " .brand a").attr('href', '/brand/page/' + drink.brand_id).html(drink.brand_view);
			}			
			
		}
		
  });
};