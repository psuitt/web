Template.foodsTemplate.rendered = function() {
	Meteor.subscribe('foods'); 
	Meteor.subscribe('ratings');
	var result = Foods.findOne({ _id: PARAMS._id});

	//if(!result)
		//Router.go('/404');

	this.find('.name').innerHTML = result.name;
	this.find('.totalRating').innerHTML = result.ratingTotal_calc;
	
  if (Meteor.user()) {
		var userRating = Ratings.findOne({_id: { $in: result.ratings}, user_id: Meteor.userId()});
		if (userRating) {
			var className = this.find('.rating.' + userRating.rating).className;
			this.find('.rating.' + userRating.rating).className = className + " selected";
		}
         // this.render('foodsTemplate');

          // stop the rest of the before hooks and the action function 
          //this.stop();
  }  
};
