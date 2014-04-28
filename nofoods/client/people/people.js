var userDataSub,
		ratingSub,
		foodSub,
		drinkSub;
		
Template.people.destroyed = function () {
	userDataSub && userDataSub.stop();
	ratingSub && ratingSub.stop();
	foodSub && foodSub.stop();
	drinkSub && drinkSub.stop();
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
			
			var div = $("<div class='myrating myfoods'></div>");
			var title = $("<span class='name myfoods'><a></a></span>");
			var brand = $("<span class='brand myfoods'><a></a></span>");
			var ratingSpan = $("<span class='rating'></span>");
			var ratingNumber = $("<span class='ratingNum'></span>");
			
			title.addClass("lower");

			if (rating.food_id) {
				div.addClass(rating.food_id);
				food_ids.push(rating.food_id);
			} else {
				div.addClass(rating.drink_id);
				drink_ids.push(rating.drink_id);			
			}

			var i = (Math.round((rating.rating * 2))*10).toString();
			
			ratingNumber.html(rating.rating);
			ratingSpan.addClass("x"+i);	

			div.append(title);
			div.append(brand);
			div.append(ratingSpan);
			div.append(ratingNumber);

			if (rating.food_id) {
				fDiv.append(div);
			} else {
				dDiv.append(div);
			}
			
		});

		if (food_ids.length !== 0 || drink_ids.length !== 0) {
			findUserFoods(food_ids, drink_ids);
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

// Similar code in myfoods.
var findUserFoods = function(food_ids, drink_ids) {
	
	if (food_ids.length > 0) 
		foodSub = Meteor.subscribe('foods_items', food_ids, function() {
		
			Foods.find({}).forEach(function(food) {
				$("." + food._id + " .name a").attr('href', '/food/page/' + food._id).html(food.name);
				$("." + food._id + " .brand a").attr('href', '/brand/page/' + food.brand_id).html(food.brand_view);
			});

		}); 

	if (drink_ids.length > 0) 
		drinkSub = Meteor.subscribe('drinks_items', drink_ids, function() {
		
			Drinks.find({}).forEach(function(drink) {
				$("." + drink._id + " .name a").attr('href', '/drink/page/' + drink._id).html(drink.name);
				$("." + drink._id + " .brand a").attr('href', '/brand/page/' + drink.brand_id).html(drink.brand_view);
			});

		}); 

};