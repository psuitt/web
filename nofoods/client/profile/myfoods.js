Template.myfoods.events({
		'click #myfoods-save': function (event, template) {
			var profile = {
				name: template.find('#myfoods-name').value		
			};
			Meteor.call('updateProfile', profile);
		}
});

Template.myfoods.rendered = function() {

	if (!Meteor.userId()) {
		$("#myfoods_ratings").append("Please log in to view your ratings.");		
		return;	
	}

	var user = Meteor.user(),
			wishlist;

	if (user.profile) {
		$('#myfoods-name').val(user.profile.name);
		wishlist = user.profile.wishlist;
	}

	Meteor.subscribe('ratings_my', function() {
		var food_ids = [],
				drink_ids = [],
				jDiv = $("#myfoods_ratings"),
				wDiv = $("#myfoods_wishlist");

		jDiv.html("");
		wDiv.html("");

		Ratings.find({}).forEach(function(rating) {
			
			var div = $("<div class='myrating myfoods'></div>");
			var title = $("<span class='name myfoods'></span>");
			var brand = $("<span class='brand myfoods'></span>");
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

			jDiv.append(div);
		});

		if (wishlist) {

			for (var i = 0, l = wishlist.length; i < l ; i += 1) {

				var div = $("<div class='myrating myfoods'></div>");
				var title = $("<span class='name myfoods'></span>");
				var brand = $("<span class='brand myfoods'></span>");

				title.addClass("lower");

				if (wishlist[i].food_id) {
					div.addClass(wishlist[i].food_id);
					food_ids.push(wishlist[i].food_id);										
				} else {
					div.addClass(wishlist[i].drink_id);
					drink_ids.push(wishlist[i].drink_id);
				}	

				div.append(title);
				div.append(brand);

				// Reverse the order they were added.
				wDiv.prepend(div);		

			}

		} else {
			wDiv.append("No wish list items found");
		}

		if (food_ids.length != 0 || drink_ids.length != 0) {
			findUserFoods(food_ids, drink_ids);
		} else {
			jDiv.append("No ratings found");
		}

	}); 
	
};

var findUserFoods = function(food_ids, drink_ids) {
	
	if (food_ids.length > 0) 
		Meteor.subscribe('foods_items', food_ids, function() {
		
			Foods.find({}).forEach(function(food) {
				$("." + food._id + " .name").html(food.name);
				$("." + food._id + " .brand").html(food.brand_view);
			});

		}); 

	if (drink_ids.length > 0) 
		Meteor.subscribe('drinks_items', drink_ids, function() {
		
			Drinks.find({}).forEach(function(drink) {
				$("." + drink._id + " .name").html(drink.name);
				$("." + drink._id + " .brand").html(drink.brand_view);
			});

		}); 

};

