var drinkSub,
		nofoodsRating;

Template.drinksTemplate.destroyed = function () {
	drinkSub && drinkSub.stop();
};

Template.drinksTemplate.rendered = function() {
	
	drinkSub = Meteor.subscribe('drinks_item', PARAMS._id, function() {
		done();
	});
	
	nofoodsRating = $('div.ratingDiv').nofoodsrating({
		hearts:6,
		select: function(rating) {
			var id = updateDrink({
				rating: rating,
				_id: PARAMS._id		
			}, reload);	
		}
	});		

	$('span.wishstar').on('click', function() {
		Meteor.call('addToWishList', {drink_id: PARAMS._id});
		$(".wishstar").toggleClass("x100", true);		
	});   
	
};

Template.drinksTemplate.events({
});

var done = function() {
	// This can sometime contain more data if froming from another page.
	var drink = Drinks.findOne({_id : PARAMS._id});

	if(!drink)
		Router.go('/404');

	$('.name').html(drink.name);
	$('.brand').html(NoFoods.lib.createBrandLink(drink.brand_id, drink.brand_view));
	$('.totalRating').html(drink.rating_calc);
	$('.totalCount').html(drink.ratingcount_calc);
	$('.foods-location').html(drink.address_view);
	
  if (Meteor.user()) {

		loadUserData();
		
		var ratingSub = Meteor.subscribe('ratings_mydrink', drink._id, function() {
			var userRating = Ratings.findOne({user_id: Meteor.userId()});
			if (userRating) {
				nofoodsRating.setValue(userRating.rating);
			} else {
				nofoodsRating.setValue(0);
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
				if (user.profile.wishlist[i].drink_id === PARAMS._id) {
					$(".wishstar").toggleClass("x100", true);
					break;
				}
			}
		}

	}

}

var reload = function(response) {

	$('.totalRating').html(response.data.rating_calc);
	$('.totalCount').html(response.data.ratingcount_calc);

};



