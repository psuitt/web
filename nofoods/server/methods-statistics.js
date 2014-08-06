Meteor.methods({

	addRating: function(options) {
		if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
	
		check(options, {
			ratingcount: Number,
      food_id: Match.Optional(NonEmptyString),
      drink_id: Match.Optional(NonEmptyString)
    });
    
	},

	addCountry: function(options) {
	
		if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
	
		check(options, {
      country: NonEmptyString,
      countrycode: NonEmptyString,
      food_id: Match.Optional(NonEmptyString),
      drink_id: Match.Optional(NonEmptyString)
    });
    
    if (!options.food_id && !options.drink_id) 
    	throw new Meteor.Error(500, "You must add a food or drink to the country");
    
    var query = {
    	_type: "country_stat",
			country: options.country,
			countrycode: options.countrycode
		};
    
    var findOne = Statistics.findOne(query);

		if (!findOne) {
			
			var stat = {
				_id: Random.id(),
				_type: "country_stat",
				country: options.country,
				countrycode: options.countrycode,
				length: 1,
				food_ids: [],
				drink_ids: [],
				date: Date.now()
			};		
			
			if (options.food_id) {
				stat.food_ids = [options.food_id];
			} else {
				stat.drink_ids = [options.drink_id];
			}
		
			var statistics_id = Statistics.insert(stat);
	
		} else if (options.food_id) {
			Statistics.update(
				query, 
				{ $addToSet: { food_ids: options.food_id } }
			);
			Statistics.update(
				query, 
				{ $set: { length: (findOne.length + 1) } }
			);
		} else {
			Statistics.update(
				query, 
				{ $addToSet: { drink_ids: options.drink_id } }
			);
			Statistics.update(
				query, 
				{ $set: { length: (findOne.length + 1) } }
			);
		}		
			
	}

});