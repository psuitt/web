Ratings = new Meteor.Collection("ratings");
Foods = new Meteor.Collection("foods");
Drinks = new Meteor.Collection("drinks");
Brands = new Meteor.Collection("brands");

// Subset lists
//FoodsItem = new Meteor.Collection("foodsitem");

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

updateDrink = function (options) {
  Meteor.call('updateDrink', options);
};

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var RatingCheck = Match.Where(function (x) {
  check(x, Number);
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5;
});

var FoodTypeCheck = Match.Where(function (x) {
  check(x, String);
  return x === "Drink" || x === "Food";
});

var tokenize = function(s) {
	var l = s.toLowerCase();
	var sp = l.split(" ");
	var uniqueArray = [];
	for (var i = 0, l = sp.length; i < l ; i += 1) {
		if (uniqueArray.indexOf(sp[i]) === -1)
			uniqueArray.push(sp[i]);	
	};
	return uniqueArray;
};

Meteor.methods({

	createFood: function (options) {

		check(options, {
      name: NonEmptyString,
      brand: NonEmptyString,
      rating: RatingCheck,
			type: FoodTypeCheck,
			_id: NonEmptyString,
			brand_id: Match.Optional(NonEmptyString)
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var brand_id = Brands.insert({
			_id: Random.id(),
			name: options.brand, 
			rating_calc: options.rating
		});

		var ratingObj = {
			_id: Random.id(),
			user_id: this.userId, 
			rating: options.rating
		};

		var tokens = tokenize(options.name + " " + options.brand);

		switch (options.type) {
			case "Food":
				Foods.insert({
					_id: options._id,
					brand_id: brand_id,
					brand_view: options.brand, 
					keywords: tokens,
					name: options.name,
					rating_calc: options.rating,
					ratingcount_calc: 1,
					date: Date.now()
				});
				ratingObj.food_id = options._id;
				break;
			case "Drink":
				Drinks.insert({
					_id: options._id,
					brand_id: brand_id,
					brand_view: options.brand, 
					keywords: tokens,
					name: options.name,
					rating_calc: options.rating,
					ratingcount_calc: 1,
					date: Date.now()
				});
				ratingObj.drink_id = options._id;
				break;
			default:
				throw new Meteor.Error(501, "The server does not support this functionality");
		}
		

		var rating_Id = Ratings.insert(ratingObj);

    return options._id;

  },

	updateFood: function (options) {

		check(options, {
      rating: RatingCheck,
			_id: NonEmptyString
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var userRating = Ratings.findOne({food_id: options._id, user_id: this.userId});

		if (!userRating) {

			var rating_Id = Ratings.insert({
				_id: Random.id(),
				food_id: options._id,
				user_id: this.userId, 
				rating: options.rating
			});

		} else {
			Ratings.update(userRating._id, { $set: { rating: options.rating } } );
		}

		//Recalculate Rating total
		var foodRatings = Ratings.find({food_id: options._id}),
				count = foodRatings.count();
		var total = 0,
				length = 0;

		foodRatings.forEach(function(rating) {
			total += rating.rating;
			length += 1;
		});

		var avg = (total/parseFloat(length)).toFixed(2);

		if (avg.lastIndexOf('0') === 3) {
			avg = avg.substring(0, 3);
			avg = avg.replace('.0', '');
		}

		Foods.update(options._id, { $set: {rating_calc: avg, ratingcount_calc: count } } );

	},

	updateDrink: function (options) {

		check(options, {
      rating: RatingCheck,
			_id: NonEmptyString
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var userRating = Ratings.findOne({drink_id: options._id, user_id: this.userId});

		if (!userRating) {

			var rating_Id = Ratings.insert({
				_id: Random.id(),
				drink_id: options._id,
				user_id: this.userId, 
				rating: options.rating
			});

		} else {
			Ratings.update(userRating._id, { $set: { rating: options.rating } } );
		}

		//Recalculate Rating total
		var drinkRatings = Ratings.find({drink_id: options._id}),
				count = drinkRatings.count();
		var total = 0,
				length = 0;

		drinkRatings.forEach(function(rating) {
			total += rating.rating;
			length += 1;
		});

		var avg = (total/parseFloat(length)).toFixed(2);

		if (avg.lastIndexOf('0') === 3) {
			avg = avg.substring(0, 3);
			avg = avg.replace('.0', '');
		}

		Drinks.update(options._id, { $set: {rating_calc: avg, ratingcount_calc: count } } );

	},

	updateProfile: function (options) {
		check(options, {
      name: Match.Optional(NonEmptyString)
    });

		Meteor.users.update({_id: this.userId}, { $set: { "profile.name": options.name } });

	},

	addToWishList: function (options) {
		check(options, {
      food_id: Match.Optional(NonEmptyString),
			drink_id: Match.Optional(NonEmptyString)
    });

		var wish = {
			food_id: options.food_id,
			drink_id: options.drink_id,
			date: Date.now()
		};
		
		var query = {
			_id: this.userId, 
			"profile.wishlist.food_id": options.food_id,
			"profile.wishlist.drink_id": options.drink_id
		};

		var findOne = Meteor.users.findOne(query);

		if (!findOne) {
			Meteor.users.update({_id: this.userId}, { $addToSet: { "profile.wishlist": wish } });
		}

	}
	
});

