Template.foodsTemplate.rendered = function() {
	Meteor.subscribe('foods', function() {
		Meteor.subscribe('ratings', function() {done();});
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
	var result = Foods.findOne({ _id: PARAMS._id});

	//if(!result)
		//Router.go('/404');

	$('.name').html(result.name);
	$('.totalRating').html(result.ratingTotal_calc);
	
  if (Meteor.user()) {
		var userRating = Ratings.findOne({_id: { $in: result.ratings}, user_id: Meteor.userId()});
		if (userRating) {
			setRatingSelected(userRating.rating);
		}
         // this.render('foodsTemplate');

          // stop the rest of the before hooks and the action function 
          //this.stop();
  }  
};

var setRatingSelected = function(n) {
	$('.rating.selected').removeClass('selected');
	$('.rating').eq(n-1).addClass('selected');
};



