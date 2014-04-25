var foodSub;

Template.foodsTemplate.destroyed = function () {
	foodSub && foodSub.stop();
};

Template.foodsTemplate.rendered = function() {
	
	foodSub = Meteor.subscribe('foods_item', PARAMS._id, function() {done();});
	
	$('div.ratingDiv span.rating').on('click', function() {
		var index = $(this).index();			
		$('div.ratingDiv span.rating').each(function() {
			$(this).toggleClass('x100', $(this).index() <= index);						
		});
		var last = $('div.ratingDiv span.rating.x100').last();
		var rating = parseInt((last.index() + 1), 10);
	
		var id = updateFood({
			rating: rating,
			_id: PARAMS._id		
		}, reload);
		
	});	

	$('span.wishstar').on('click', function() {
		Meteor.call('addToWishList', {food_id: PARAMS._id});
		$(".wishstar").toggleClass("x100", true);	
	}); 
	
};

Template.foodsTemplate.events({
		
});

var done = function() {
	// This can sometime contain more data if froming from another page.
	var food = Foods.findOne({_id : PARAMS._id});

	if(!food)
		Router.go('/404');

	$('.name').html(food.name);
	$('.brand').html(food.brand_view);
	$('.totalRating').html(food.rating_calc);
	$('.totalCount').html(food.ratingcount_calc);
	$('.foods-location').html(food.address_view);

  if (Meteor.user()) {
		loadUserData();

		var ratingSub = Meteor.subscribe('ratings_myfood', food._id, function() {
			var userRating = Ratings.findOne({user_id: Meteor.userId()});
			if (userRating) {
				setRatingSelected(userRating.rating);
			}
			ratingSub.stop();
		});

  }  
};

var loadUserData = function() {

	var user = Meteor.user();

	if (user.profile) {

		if (user.profile.wishlist) {
			for (var i = 0, l = user.profile.wishlist.length; i < l; i += 1) {
				if (user.profile.wishlist[i].food_id === PARAMS._id) {
					$(".wishstar").toggleClass("x100", true);
					break;
				}
			}
		}

	}

};

var reload = function(response) {

	$('.totalRating').html(response.data.rating_calc);
	$('.totalCount').html(response.data.ratingcount_calc);

};

var setRatingSelected = function(n) {
	$('div.ratingDiv span.rating').each(function() {
		$(this).toggleClass('x100', $(this).index() <= (n-1));						
	});	
};



