var userDataSub,
		ratingSub,
		foodSub,
		drinkSub;

Template.myfoods.events({
		'click #myfoods-save': function (event, template) {
			var profile = {
				name: template.find('#myfoods-name').value		
			};
			Meteor.call('updateProfile', profile, function(err) {
				if (!err)
					$('div.alertmessage').html('Save was successful!');
					$('div.alertmessage').show().delay(3500).fadeOut(1000);
			});
		}
});

Template.myfoods.destroyed = function() {
	userDataSub && userDataSub.stop();
	ratingSub && ratingSub.stop();
	foodSub && foodSub.stop();
	drinkSub && drinkSub.stop();
};

Template.myfoods.rendered = function() {
	
	setPath();

	$('#myfoods-nav a').click(function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	});

	if (!Meteor.userId()) {
		$("#myfoods-ratingsfoods").append("Please log in to view your ratings.");	
		$("#myfoods-ratingsdrinks").append("Please log in to view your ratings.");		
		alert("Not logged in!");
		return;	
	}

	userDataSub = Meteor.subscribe('userdata', function() { 
		var user = Meteor.user(),
				wishlist;

		if (user && user.profile) {
			$('#myfoods-username').html(user.username);
			$('#myfoods-joined').html("Joined " + NoFoods.lib.formatDate(user.profile.date));
			$('#myfoods-name').val(user.profile.name);
			$('#myfoods-bonus').html(user.profile.bonusHearts);
			wishlist = user.profile.wishlist;
			loadLinks(user.profile.links);
		}
		
		loadRatings(wishlist);	
	
	});

	$('#myfoods-wishlist').on('click', 'a.remove', function(e) {
		var options = {};
		if ($(this).data('food_id')) {
			options.food_id = $(this).data('food_id');
		} else {
			options.drink_id = $(this).data('drink_id');
		}
		Meteor.call( 'removeFromWishList', options );	
		$(this).parent().remove();
		e.preventDefault();
	});
	
	$('#myfoods-links').on('click', 'a.remove', function(e) {
		Meteor.call( 'removeFromLinks', { username: $(this).data('username') } );	
		$(this).parent().remove();
		e.preventDefault();
	});
	
};

var loadRatings = function(wishlist) {
	
	ratingSub = Meteor.subscribe('ratings_my', function() {
		var food_ids = [],
				drink_ids = [],
				fDiv = $("#myfoods-ratingsfoods"),
				dDiv = $("#myfoods-ratingsdrinks"),
				wDiv = $("#myfoods-wishlist");

		wDiv.html("");

		Ratings.find({}).forEach(function(rating) {
			
			if (rating.food_id) {
				food_ids.push(rating.food_id);
			} else {
				drink_ids.push(rating.drink_id);
			}

		});
		
		$("#myfoods-foods").append(NoFoods.lib.createPagingDiv(food_ids.length / 2, getFoodsPage));
		$("#myfoods-drinks").append(NoFoods.lib.createPagingDiv(drink_ids.length / 2, getDrinksPage));

		getFoodsPage(1);
		getDrinksPage(1);

		if (wishlist) {

			for (var i = 0, l = wishlist.length; i < l ; i += 1) {

				var div = $("<div class='myrating myfoods'></div>");
				var title = $("<span class='name myfoods'><a></a></span>");
				var brand = $("<span class='brand myfoods'><a></a></span>");
				var removeLink = $("<a class='remove myfoods' href='#'>Remove</a>");

				title.addClass("lower");

				if (wishlist[i].food_id) {
					div.addClass(wishlist[i].food_id);
					food_ids.push(wishlist[i].food_id);	
					removeLink.data('food_id', wishlist[i].food_id);									
				} else {
					div.addClass(wishlist[i].drink_id);
					drink_ids.push(wishlist[i].drink_id);
					removeLink.data('drink_id', wishlist[i].drink_id);
				}	

				div.append(title);
				div.append(brand);
				div.append(removeLink);

				// Reverse the order they were added.
				wDiv.prepend(div);		

			}

		} else {
			wDiv.append("No wish list items found");
		}

		if (food_ids.length != 0 || drink_ids.length != 0) {
			findUserFoods(food_ids, drink_ids);
		} else {
			fDiv.append("No ratings found");
			dDiv.append("No ratings found");
		}

	}); 

};

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

var loadLinks = function(links) {
	
	var contentDiv = $("#myfoods-links");
	
	contentDiv.html("");
	
	if (links) {

		for (var i = 0, l = links.length; i < l ; i += 1) {

			var div = $("<div class='myrating myfoods'></div>");
			var title = $("<a class='name myfoods'></a>");
			var removeLink = $("<a class='remove myfoods' href='#'>Remove</a>");
			var username = links[i].username;

			if (!username)
				continue;

			title.addClass("lower");
			
			title.attr('href', '/people/page/' + username);
			title.html(username);

			removeLink.data('username', username);

			div.append(title);
			div.append(removeLink);

			// Reverse the order they were added.
			contentDiv.prepend(div);		

		}

	} else {
		contentDiv.append("No links found");
	}

	
};

var getFoodsPage = function(page) {
	Meteor.call('getUserFoodRatings', page, function(err, data) {
		
		if (!err) {
			
			var fDiv = $("#myfoods-ratingsfoods");
			
			fDiv.html("");
			
			for (var i = 0, len = data.ratings.length; i < len; i += 1) {
				var rating = data.ratings[i],
						div = createRatingDiv(rating);
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

var getDrinksPage = function(page) {
	Meteor.call('getUserDrinkRatings', page, function(err, data) {
		
		if (!err) {
			
			var dDiv = $("#myfoods-ratingsdrinks");
			
			dDiv.html("");
			
			for (var i = 0, len = data.ratings.length; i < len; i += 1) {
				var rating = data.ratings[i],
						div = createRatingDiv(rating);
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

var createRatingDiv = function(rating) {

	var div = $("<div class='myrating myfoods'></div>"),
			name = $("<span class='name myfoods'></span>"),
			nameLink = $("<a></a>"),
			brand = $("<span class='brand myfoods'></span>"),
			brandLink = $("<a></a>"),
			ratingSpan = $("<span class='rating'></span>"),
			ratingNumber = $("<span class='ratingNum'></span>"),
			toAdd = null;
	
	name.addClass("lower");

	var i = (Math.round((rating.rating * 2))*10).toString();
	
	ratingNumber.html(rating.rating);
	ratingSpan.addClass("x"+i);	
	

	name.append(nameLink);
	brand.append(brandLink);
	div.append(name);
	div.append(brand);
	div.append(ratingSpan);	
	div.append(ratingNumber);
	
	return div;

};

