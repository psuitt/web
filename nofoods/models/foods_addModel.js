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

Brands.allow({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
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

createFood = function (options, callback) {
  var id = Random.id(),
			response = {};

	response.id = id;

  Meteor.call('createFood', _.extend({ _id: id }, options), function(e) {
		response.error = e;
		callback && callback(response);
	});	

  return response;
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
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5 || x === 6;
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
			brand_id: Match.Optional(NonEmptyString),
			image: Match.Optional(NonEmptyString),
			address_id: Match.Optional(NonEmptyString),
			address: Match.Optional(NonEmptyString),
			longitude: Match.Optional(Number),
			latitude: Match.Optional(Number),
			city: Match.Optional(NonEmptyString),
			state: Match.Optional(NonEmptyString),
			statecode: Match.Optional(NonEmptyString),
			country: Match.Optional(NonEmptyString),
			countrycode: Match.Optional(NonEmptyString)
    });

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var tokens = tokenize(options.name + " " + options.brand);

		Meteor.call('validate', tokens);
		
		var address = {
			address_id: options.address_id,
			address: options.address,
			longitude: options.longitude,
			latitude: options.latitude,
			city: options.city,
			state: options.state,
			statecode: options.statecode,
			country: options.country,
			countrycode: options.countrycode
		};
			
		var brand_id = options.brand_id || Brands.insert({
			_id: Random.id(),
			name: options.brand,
			locations: [address],
			date: Date.now()
		});

		var ratingObj = {
			_id: Random.id(),
			user_id: this.userId, 
			rating: options.rating,
			date: Date.now()
		};

		var fooddrink = {
			_id: options._id,
			brand_id: brand_id,
			brand_view: options.brand,
			address_view: options.address, 
			keywords: tokens,
			name: options.name,
			rating_calc: options.rating,
			ratingcount_calc: 1,
			date: Date.now()
		},
			countryStat = false;
			
		if (options.country && options.countrycode) {
			countryStat = {};
			countryStat.country = options.country;
			countryStat.countrycode = options.countrycode;
		}

		if (options.image) 
			fooddrink.image = options.image;

		switch (options.type) {
			case "Food":
				Foods.insert(fooddrink);
				ratingObj.food_id = options._id;
				countryStat.food_id = options._id;
				break;
			case "Drink":
				Drinks.insert(fooddrink);
				ratingObj.drink_id = options._id;
				countryStat.drink_id = options._id;
				break;
			default:
				throw new Meteor.Error(501, "The server does not support this functionality");
		}
		
		var rating_Id = Ratings.insert(ratingObj);
		
		if (countryStat) {
			Meteor.call('addCountry', countryStat);
		}

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
				rating: options.rating,
				date: Date.now()
			});

		} else {
			Ratings.update(userRating._id, { $set: { rating: options.rating, date: Date.now() } } );
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
				rating: options.rating,
				date: Date.now()
			});

		} else {
			Ratings.update(userRating._id, { $set: { rating: options.rating, date: Date.now() } } );
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

	}
	
});

