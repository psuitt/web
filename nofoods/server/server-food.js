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
      throw new Meteor.Error(403, "You must be logged in to add an item");
    if (!Meteor.user().active) 
    	throw new Meteor.Error(500, "Adding is currently disabled for your account.");

		var tokens = NoFoodz.utils.Tokenize(options.name + " " + options.brand);

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
			
		var brand_id = false;
		
		//if (options.brand_id) {
		//	brand_id = options.brand_id
		//} else {
		
			var brand = Brands.findOne({name: options.brand});
			
			// Matching name exists merge
			if (brand) {
				brand_id = brand._id;
			} else {
				// Create a new one
				brand_id = Brands.insert({
										_id: Random.id(),
										name: options.brand,
										locations: [], //[address], Empty for now.
										date: Date.now(),
										user_id: this.userId
									});
			}
		
		//}

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
			date: Date.now(),
			user_id: this.userId
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
			case "food":
				Foods.insert(fooddrink);
				ratingObj.food_id = options._id;
				countryStat.food_id = options._id;
				break;
			case "drink":
				Drinks.insert(fooddrink);
				ratingObj.drink_id = options._id;
				countryStat.drink_id = options._id;
				break;
			default:
				throw new Meteor.Error(501, "The server does not support this functionality");
		}
		
		var rating_Id = NoFoodz.rating.create(ratingObj);
		
		if (countryStat) {
			Meteor.call('addCountry', countryStat);
		}

    return options._id;

  }
	
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
		
		var ratingDiff = options.rating,
				countDiff = 1;
	
		if (!userRating) {

			if (options.rating === 6)
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );

			var rating_Id = NoFoodz.rating.create({
				_id: Random.id(),
				food_id: options._id,
				user_id: this.userId, 
				rating: options.rating,
				date: Date.now()
			});
			
		} else {
			
			// No adjustments are needed.
			countDiff = 0;
			ratingDiff -= userRating.rating;
			
			if (userRating.rating === 6 && options.rating !== 6) {
				
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": 1 } } );
			
			} else if (userRating.rating !== 6 && options.rating === 6) {
				
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );
			}
			
			NoFoodz.rating.updateOne(userRating, { $set: { rating: options.rating, date: Date.now() } }, this.userId );
		
		}

		//Recalculate Rating total
		var food = Foods.findOne( { _id : options._id } ),
				total = 0;
		
		if (!food.ratingtotal_calc) {
			total = food.rating_calc * food.ratingcount_calc;	
		} else {
			total = food.ratingtotal_calc;
		}
		
		total += ratingDiff;
		count = food.ratingcount_calc + countDiff
		
		var avg = (total/parseFloat(count)).toFixed(2);
		
		if (avg.lastIndexOf('0') === 3) {
			avg = avg.substring(0, 3);
			avg = avg.replace('.0', '');
		}

		Foods.update(options._id, { $set: {
			rating_calc: avg, 
			ratingtotal_calc: total,
			ratingcount_calc: count 
			} } );
		
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
			throw new Meteor.Error(500, "You can not rate this above a 5");
		}
		
		var ratingDiff = options.rating,
				countDiff = 1;

		if (!userRating) {
			
			if (options.rating === 6)
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );

			var rating_Id = NoFoodz.rating.create({
				_id: Random.id(),
				drink_id: options._id,
				user_id: this.userId, 
				rating: options.rating,
				date: Date.now()
			});

		} else {
			
			// No adjustments are needed.
			countDiff = 0;
			ratingDiff -= userRating.rating;
			
			if (userRating.rating === 6 && options.rating !== 6) {
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": 1 } } );
			} else if (userRating.rating !== 6 && options.rating === 6) {
				Meteor.users.update({_id: this.userId}, { $inc: { "profile.bonusHearts": -1 } } );
			}
			NoFoodz.rating.updateOne(userRating, { $set: { rating: options.rating, date: Date.now() } }, this.userId );
		}

		//Recalculate Rating total
		var drink = Drinks.findOne( { _id : options._id } ),
				total = 0;
		
		if (!drink.ratingtotal_calc) {
			total = drink.rating_calc * drink.ratingcount_calc;	
		} else {
			total = drink.ratingtotal_calc;
		}
		
		total += ratingDiff;
		count = drink.ratingcount_calc + countDiff
		
		var avg = (total/parseFloat(count)).toFixed(2);
		
		if (avg.lastIndexOf('0') === 3) {
			avg = avg.substring(0, 3);
			avg = avg.replace('.0', '');
		}

		Drinks.update(options._id, { $set: {
			rating_calc: avg, 
			ratingtotal_calc: total,
			ratingcount_calc: count 
			} } );

		return {rating_calc: avg, ratingcount_calc: count};

	}

});