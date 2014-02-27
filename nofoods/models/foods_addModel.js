Ratings = new Meteor.Collection("ratings");
Foods = new Meteor.Collection("foods");
Drinks = new Meteor.Collection("drinks");
Brands = new Meteor.Collection("brands");

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

Ratings.allow({
  insert: function (userId, food) {
    return false; 
  },
  update: function (userId, food, fields, modifier) {
    if (userId !== food.user_id)
      return false; // not the owner

    var allowed = ["rating"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, food) {
    // not possibly yet
    return false;
  }
});

createFood = function (options) {
  var id = Random.id();
  Meteor.call('createFood', _.extend({ _id: id }, options));
  return id;
};

updateFood = function (options) {
  Meteor.call('updateFood', options);
};

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var RatingCheck = Match.Where(function (x) {
  check(x, Number);
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5;
});

Meteor.methods({
  
	createFood: function (options) {

		check(options, {
      name: NonEmptyString,
      brand: NonEmptyString,
      rating: RatingCheck,
			_id: Match.Optional(NonEmptyString)
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var id = options._id || Random.id();

		var rating_Id = Ratings.insert({
			_id: id,
			user_id: this.userId, 
			rating: options.rating
		});

		Foods.insert({
			_id: Random.id(),
			name: options.name, 
			brand: options.brand,
			ratingTotal_calc: options.rating,  
			ratings: [rating_Id]
		});

		var results = Foods.find({});

    return id;
  },

	updateFood: function (options) {

		check(options, {
      rating: RatingCheck,
			_id: NonEmptyString
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var toUpdate = Foods.findOne({_id: options._id});

		var userRating = Ratings.findOne({_id: { $in: toUpdate.ratings}, user_id: this.userId});

		var ratings = [];

		if (!userRating) {
			var rating_Id = Ratings.insert({
				_id: Random.id(),
				user_id: this.userId, 
				rating: options.rating
			});

			ratings = toUpdate.ratings;

			ratings.push(rating_Id);

			Foods.update(options._id, { $set: {ratings: ratings } } );
		} else {
			Ratings.update(userRating._id, { $set: { rating: options.rating } } );
			ratings.push(userRating._id);
		}

		//Recalculate Rating total
		var userRatings = Ratings.find({_id: { $in: ratings}});
		var total = 0;

		userRatings.forEach(function(rating) {
			total += rating.rating;
		});

		var avg = (total/ratings.length);

		Foods.update(options._id, { $set: {ratingTotal_calc: avg } } );

	}
});

