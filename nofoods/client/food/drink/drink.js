Template.drinksTemplate.rendered = function() {
	Meteor.subscribe('drinks_item', PARAMS._id, function() {
		done();
	}); 
	
};

Template.drinksTemplate.events({
		'click .rating': function (event, template) {
			if (template.find(".rating.selected")) {
				template.find(".rating.selected").className = "rating";
			}
			event.target.className = "rating selected";

			var rating = parseInt(template.find(".selected").innerHTML, 10); 
		
			var id = updateDrink({
				rating: rating,
				_id: PARAMS._id		
			});
		}
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
	$('.rating.selected').removeClass('selected');
	$('.rating').eq(n-1).addClass('selected');
};



