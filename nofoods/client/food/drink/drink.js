Template.drinksTemplate.rendered = function() {
	Meteor.subscribe('drinks_item', PARAMS._id, function() {
		done();
	});

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
	$('.brand').html(drink.brand_view);
	$('.totalRating').html(drink.rating_calc);
	
  if (Meteor.user()) {
		Meteor.subscribe('ratings', function() {
			var userRating = Ratings.findOne({drink_id: drink._id, user_id: Meteor.userId()});
			if (userRating) {
				setRatingSelected(userRating.rating);
			}
		});

  }  
};

var setRatingSelected = function(n) {
	$('div.ratingDiv span.rating').each(function() {
		$(this).toggleClass('x100', $(this).index() <= (n-1));						
	});	
};



