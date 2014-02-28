Template.foodsTemplate.rendered = function() {
	Meteor.subscribe('foods_item', PARAMS._id, function() {
		done();
	}); 
	
};

Template.foodsTemplate.events({
		'click .rating': function (event, template) {
			if (template.find(".rating.selected")) {
				template.find(".rating.selected").className = "rating";
			}
			event.target.className = "rating selected";

			var rating = parseInt(template.find(".selected").innerHTML, 10); 
		
			var id = updateFood({
				rating: rating,
				_id: PARAMS._id		
			});
		}
});

var done = function() {
	var food = Foods.findOne({});

	if(!food)
		Router.go('/404');

	$('.name').html(food.name);
	$('.totalRating').html(food.rating_calc);
	
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
	$('.rating.selected').removeClass('selected');
	$('.rating').eq(n-1).addClass('selected');
};



