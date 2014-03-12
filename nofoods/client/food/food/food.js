Template.foodsTemplate.rendered = function() {
	Meteor.subscribe('foods_item', PARAMS._id, function() {
		done();
	});

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
		});		
	});	

	$('span.wishstar').on('click', function() {
		Meteor.call('addToWishList', {food_id: PARAMS._id});	
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
	
  if (Meteor.user()) {
		Meteor.subscribe('ratings', function() {
			var userRating = Ratings.findOne({food_id: food._id, user_id: Meteor.userId()});
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



