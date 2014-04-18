Foods.allow({
  insert: function (userId, food) {
    return false;
  },
  update: function (userId, food) {
    return false;
  },
  remove: function (userId, food) {
    // not possibly yet
    return false;
  }
});

Drinks.allow({
  insert: function (userId, food) {
    return false;
  },
  update: function (userId, food) {
    return false;
  },
  remove: function (userId, food) {
    // not possibly yet
    return false;
  }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var RatingCheck = Match.Where(function (x) {
  check(x, Number);
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5 || x === 6;
});

Meteor.methods({
	
	updateFood: function (options) {

		check(options, {
      rating: RatingCheck,
			_id: NonEmptyString
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var userRating = Ratings.findOne({food_id: options._id, user_id: this.userId});

		var user = Meteor.users.findOne( {_id: this.userId} ),
				bonusHearts = user.profile.bonusHearts;
		
		if (!user.profile.bonusHearts && user.profile.bonusHearts !== 0) {
			Meteor.users.update({_id: this.userId}, { $set: { "profile.bonusHearts": 10 } } );
			bonusHearts = 10;
		}
	
		if (bonusHearts < 1 && options.rating > 5) {
			throw new Meteor.Error(500, "You can not rate thins above a 5");
		}

		if (!userRating) {

			if (options.rating === 6)
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );

			var rating_Id = Ratings.insert({
				_id: Random.id(),
				food_id: options._id,
				user_id: this.userId, 
				rating: options.rating,
				date: Date.now()
			});

		} else {
			if (userRating.rating === 6 && options.rating !== 6) {
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": 1 } } );
			} else if (userRating.rating !== 6 && options.rating === 6) {
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );
			}
			Ratings.update(userRating._id, { $set: { rating: options.rating, date: Date.now() } } );
		}

		//Recalculate Rating total
		var foodRatings = Ratings.find({food_id: options._id}),
				count = foodRatings.count();
		var total = 0;

		foodRatings.forEach(function(rating) {
			total += rating.rating;
		});

		var avg = (total/parseFloat(count)).toFixed(2);

		if (avg.lastIndexOf('0') === 3) {
			avg = avg.substring(0, 3);
			avg = avg.replace('.0', '');
		}

		Foods.update(options._id, { $set: {rating_calc: avg, ratingcount_calc: count } } );
		
		return {rating_calc: avg, ratingcount_calc: count};

	},

	updateDrink: function (options) {

		check(options, {
      rating: RatingCheck,
			_id: NonEmptyString
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var userRating = Ratings.findOne({drink_id: options._id, user_id: this.userId});

		var user = Meteor.users.findOne( {_id: this.userId} ),
				bonusHearts = user.profile.bonusHearts;
		
		if (!user.profile.bonusHearts) {
			Meteor.users.update({_id: this.userId}, { $set: { "profile.bonusHearts": 10 } } );
			bonusHearts = 10;
		}
	
		if (bonusHearts < 1 && options.rating > 5) {
			throw new Meteor.Error(500, "You can not rate thins above a 5");
		}

		if (!userRating) {
			
			if (options.rating === 6)
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );

			var rating_Id = Ratings.insert({
				_id: Random.id(),
				drink_id: options._id,
				user_id: this.userId, 
				rating: options.rating,
				date: Date.now()
			});

		} else {
			if (userRating.rating === 6 && options.rating !== 6) {
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": 1 } } );
			} else if (userRating.rating !== 6 && options.rating === 6) {
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );
			}
			Ratings.update(userRating._id, { $set: { rating: options.rating, date: Date.now() } } );
		}

		//Recalculate Rating total
		var drinkRatings = Ratings.find({drink_id: options._id}),
				count = drinkRatings.count();
		var total = 0;

		drinkRatings.forEach(function(rating) {
			total += rating.rating;
		});

		var avg = (total/parseFloat(count)).toFixed(2);

		if (avg.lastIndexOf('0') === 3) {
			avg = avg.substring(0, 3);
			avg = avg.replace('.0', '');
		}

		Drinks.update(options._id, { $set: {rating_calc: avg, ratingcount_calc: count } } );

		return {rating_calc: avg, ratingcount_calc: count};

	}

});