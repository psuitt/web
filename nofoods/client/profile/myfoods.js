Template.myfoods.events({
		'click #save': function (event, template) {
			var profile = {
				name: template.find('#name').value		
			};
			Meteor.call('updateProfile', profile);
		}
});

Template.myfoods.rendered = function() {

	if (!Meteor.userId()) {
		$("#myfoods_ratings").append("Please log in to view your ratings.");		
		return;	
	}

	var user = Meteor.user();

	if (user.profile) {
		$('#name').val(user.profile.name);
	}

	Meteor.subscribe('ratings_my', function() {
		var food_ids = [],
				drink_ids = [],
				jDiv = $("#myfoods_ratings");

		jDiv.html("");

		Ratings.find({}).forEach(function(rating) {
			
			var div = $("<div class='rating'></div>");
			var title = $("<span class='name'></span>");
			var brand = $("<span class='brand'></span>");
			var ratingSpan = $("<span class='rating'></span>");
			
			if (rating.food_id) {
				div.attr("id", rating.food_id);
				food_ids.push(rating.food_id);
			} else {
				div.attr("id", rating.drink_id);
				drink_ids.push(rating.drink_id);			
			}

			var i = (Math.round((rating.rating * 2))*10).toString();
			
			ratingSpan.html(rating.rating);
			ratingSpan.addClass("x"+i);

			div.append(title);
			div.append(brand);
			div.append(ratingSpan);

			jDiv.append(div);
		});

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
				$("#" + food._id + " .name").html(food.name);
				$("#" + food._id + " .brand").html(food.brand);
			});

		}); 

	if (drink_ids.length > 0) 
		Meteor.subscribe('drinks_items', drink_ids, function(drink_ids) {
		
			Drinks.find({}).forEach(function(drink) {
				$("#" + drink._id + " .name").html(drink.name);
				$("#" + drink._id + " .brand").html(drink.brand);
			});

		}); 

};
