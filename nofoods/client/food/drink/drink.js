Template.drinksTemplate.rendered = function() {
	Meteor.subscribe('drinks_item', PARAMS._id, function() {done();});

	$('div.ratingDiv span.rating').on('click', function() {
		var index = $(this).index();			
		$('div.ratingDiv span.rating').each(function() {
			$(this).toggleClass('x100', $(this).index() <= index);						
		});
		var last = $('div.ratingDiv span.rating.x100').last();
		var rating = parseInt((last.index() + 1), 10);
	
		var id = updateDrink({
			rating: rating,
			_id: PARAMS._id		
		});	

		done();
	
	});	

	$('span.wishstar').on('click', function() {
		Meteor.call('addToWishList', {drink_id: PARAMS._id});
		$(".wishstar").toggleClass("x100", true);		
	});   
	
	$('.searchbar input').nofoodssearch();
	
};

Template.drinksTemplate.events({
});

var done = function() {
	// This can sometime contain more data if froming from another page.
	var drink = Drinks.findOne({_id : PARAMS._id});

	if(!drink)
		Router.go('/404');

	$('.name').html(drink.name);
	$('.brand').html(drink.brand_view);
	$('.totalRating').html(drink.rating_calc);
	$('.totalCount').html(drink.ratingcount_calc);
	
  if (Meteor.user()) {

		loadUserData();
		
		Meteor.subscribe('ratings', function() {
			var userRating = Ratings.findOne({drink_id: drink._id, user_id: Meteor.userId()});
			if (userRating) {
				setRatingSelected(userRating.rating);
			}
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

var setRatingSelected = function(n) {
	$('div.ratingDiv span.rating').each(function() {
		$(this).toggleClass('x100', $(this).index() <= (n-1));						
	});	
};



