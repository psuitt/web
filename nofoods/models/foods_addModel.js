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

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var RatingCheck = Match.Where(function (x) {
  check(x, Number);
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5;
});

Meteor.methods({
  // options should include: title, description, x, y, public
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
});

