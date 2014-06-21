var userDataSub,
		foodSearch,
		drinkSearch;

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
			loadLinks(user.profile.links);
			loadAchievements(user.profile.achievements);
		}
		
		loadRatings();	
	
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
	
	$('#myfoods-foods .ratingsearch').on('keyup', function(e) {
		var code = NoFoods.lib.key.getCode(e),
				self = $(this);
		
		if (code == 13) {
			foodSearch = self.val();
			getFoodsPage(1);
		}	
	
	});
	
	$('#myfoods-drinks .ratingsearch').on('keyup', function(e) {
		var code = NoFoods.lib.key.getCode(e),
				self = $(this);
		
		if (code == 13) {
			drinkSearch = self.val();
			getDrinksPage(1);
		}	
	
	});
	
};

var loadRatings = function() {
	
	var food_ids = [],
			drink_ids = [],
			fDiv = $("#myfoods-ratingsfoods"),
			dDiv = $("#myfoods-ratingsdrinks"),
			wDiv = $("#myfoods-wishlist");

	wDiv.html("");

	getFoodsPage(1, false, true);
	getDrinksPage(1, false, true);
	getWishlistPage(1, false, true);

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

var loadAchievements = function(achievements) {

	if (achievements) {
		
		var parentDiv = $('#myfoods-achievements');
		
		for (var i = 0, l = achievements.length; i < l; i += 1) {
			var achievement = achievements[i];
			
			var div = $('<div class=\'achievement\'></div>'),
					info = $('<div class=\'info\'></div>');
			
			if (achievement.url)
				div.append('<img src=\'' + achievement.url + '\'>');
			
			info.append('<div class=\'title\'>' + achievement.title + '</div>');
				
			if (achievement.date) {
				info.append('<div class=\'date\'>' + NoFoods.lib.formatDateTime(achievement.date) + '</div>');
			} else if (achievement.progress)  {
				info.append('<div class=\'progress\'>Progress' + achievement.progress.current + '/' + achievement.progress.cap + '</div>');			
			}
			info.append('<div class=\'description\'>' + achievement.description + '</div>');
			
			div.append(info);
			
			parentDiv.append(div);
			
		}			
	}

};

var getFoodsPage = function(page, obj, count) {
	
	var obj = { 
		page: page 
	};
	
	if (foodSearch)
		obj['search'] = foodSearch;
	if (count) 
		obj.count = true;
	
	Meteor.call('getUserFoodRatings', obj, function(err, data) {
		
		if (!err && data.foods) {
			
			var fDiv = $("#myfoods-ratingsfoods");
			
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
			
			if (len === 0) {
				fDiv.append("No ratings found");			
			}
			
			if (count) {
				$("#myfoods-foods .myfoods-paging").nofoodspaging({
					max: data.count / data.maxPageSize,
					select: getFoodsPage
				});			
			}	
			
		}
		
  });
};

var getDrinksPage = function(page, obj, count) {
	
	var obj = { 
		page: page 
	};	
	
	if (drinkSearch)
		obj['search'] = drinkSearch;
	if (count) 
		obj.count = true;
	
	Meteor.call('getUserDrinkRatings', obj, function(err, data) {
		
		if (!err && data.drinks) {
			
			var dDiv = $("#myfoods-ratingsdrinks");
			
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
			
			if (len === 0) {
				dDiv.append("No ratings found");			
			}
			
			if (count) {
				$("#myfoods-drinks .myfoods-paging").nofoodspaging({
					max: data.count / data.maxPageSize,
					select: getDrinksPage
				});			
			}			
			
		}
		
  });
	
};

var getWishlistPage = function(page, obj, count) {

	var obj = { 
		page: page 
	};	
	
	if (drinkSearch)
		obj['search'] = drinkSearch;
	if (count) 
		obj.count = true;
	
	Meteor.call('getUserWishlist', obj, function(err, data) {
		
		if (!err) {
			
			var wDiv = $("#myfoods-wishlist"),
					wishlist = data.wishlist,
					len = 0;
			
			wDiv.html("");
			
			if (wishlist) {
			
				for (var i = 0, l = wishlist.length; i < l ; i += 1) {
		
					var div = $("<div class='myrating myfoods'></div>");
					var title = $("<span class='name myfoods'><a></a></span>");
					var brand = $("<span class='brand myfoods'><a></a></span>");
					var removeLink = $("<a class='remove myfoods' href='#'>Remove</a>");
		
					title.addClass("lower");
		
					if (wishlist[i].food_id) {
						div.addClass(wishlist[i].food_id);
						removeLink.data('food_id', wishlist[i].food_id);									
					} else {
						div.addClass(wishlist[i].drink_id);
						removeLink.data('drink_id', wishlist[i].drink_id);
					}	
		
					div.append(title);
					div.append(brand);
					div.append(removeLink);
		
					// Reverse the order they were added.
					wDiv.prepend(div);		
		
				}
				
				if (data.foods)
					for (var f = 0, len = data.foods.length; f < len; f += 1) {
						var food = data.foods[f];
						$("." + food._id + " .name a").attr('href', '/food/page/' + food._id).html(food.name);
						$("." + food._id + " .brand a").attr('href', '/brand/page/' + food.brand_id).html(food.brand_view);
					}		
				
				if (data.drinks)
					for (var f = 0, len = data.drinks.length; f < len; f += 1) {
						var drink = data.drinks[f];
						$("." + drink._id + " .name a").attr('href', '/drink/page/' + drink._id).html(drink.name);
						$("." + drink._id + " .brand a").attr('href', '/brand/page/' + drink.brand_id).html(drink.brand_view);
					}	
				
			}
			
			if (len === 0) {
				wDiv.append("No wish list items found");	
			}
			
			if (count) {
				$("#myfoods-wishlistpage .myfoods-paging").nofoodspaging({
					max: data.count / data.maxPageSize,
					select: getWishlistPage
				});			
			}			
			
		}
		
  });
};
