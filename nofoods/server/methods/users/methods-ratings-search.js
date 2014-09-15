Meteor.methods({
	
	getUserFoodRatings: function (options) {
		
		check(options, {
      page: PageNumber,
      count: Match.Optional(Boolean),
			user_id: Match.Optional(NonEmptyStringNoSpecialCharacters),
			search: Match.Optional(NonEmptyStringNoSpecialCharacters)
    });
		
		var response = false,
				page = options.page;
		
		var query = {
			user_id: options.user_id ? options.user_id : this.userId,
			food_id: { $exists: true }
		};
		
		var filter = {
			sort: {date: -1}
		};		
		
		if (this.userId) {
			var food_ids = [];

			response = {
				ratings: []
			};		
			
			if (!options.count) {

				filter.skip = PAGE_LIMIT*(page - 1);
				filter.limit = PAGE_LIMIT;	
				
				Ratings.find(query, filter).forEach(function (rating) {
	  			food_ids.push(rating.food_id);
	  			response.ratings.push(rating);
	  		});
	  		
			} else {
				
  			var results = Ratings.find(query, filter).fetch();
  			
  			// set the total count.
  			response.count = results.length;
  			response.maxPageSize = PAGE_LIMIT;
  			
  			var offset = PAGE_LIMIT*(page-1),
						offsetMax = PAGE_LIMIT*(page),	
						len = response.count;
	
				if (len > offsetMax) {
					len = offsetMax;
				}
			
				for (var i = offset; i < len; i += 1) {
					var rating = results[i];
					food_ids.push(rating.food_id);
	  			response.ratings.push(rating);
				}	
  			
  		}

			if (response.ratings.length > 0) {
				var foodsQuery = addSearch({ _id: { $in: food_ids } }, options);
				response.foods = Foods.find( foodsQuery ).fetch();
				
				/* Re think logic
				if (options['search']) {
					var ratingsFilter = [];
					for (var i = 0, l = response.ratings.length; i < l; i += 1) {
						for (var f = 0, len = response.foods.length; f < len; f += 1) {
							if (response.foods[f]._id === response.ratings[i].food_id) 
								ratingsFilter.push(response.ratings[i]);
						}	
					}	
					response.ratings = ratingsFilter;
					response.length = l;
				}	*/
						
			}  		
  		
  	}
  	
  	return response;
	},
	
	getUserDrinkRatings: function (options) {
		
		check(options, {
      page: PageNumber,
      count: Match.Optional(Boolean),
			user_id: Match.Optional(NonEmptyString),
			search: Match.Optional(NonEmptyString)
    });
		
		var response = false,
				page = options.page;
		
		var query = {
			user_id: options.user_id ? options.user_id : this.userId,
			drink_id: { $exists: true }
		};
		
		var filter = {
			sort: {date: -1}
		};		
		
		if (this.userId) {
			
			var drink_ids = [];

			response = {
				ratings: []
			};		
			
  		if (!options.count) {

				filter.skip = PAGE_LIMIT*(page - 1);
				filter.limit = PAGE_LIMIT;	
				
				Ratings.find(query, filter).forEach(function (rating) {
	  			drink_ids.push(rating.drink_id);
	  			response.ratings.push(rating);
	  		});
	  		
			} else {
				
  			var results = Ratings.find(query, filter).fetch();
  			
  			// set the total count.
  			response.count = results.length;
  			response.maxPageSize = PAGE_LIMIT;
  			
  			var offset = PAGE_LIMIT*(page-1),
						offsetMax = PAGE_LIMIT*(page),	
						len = response.count;
	
				if (len > offsetMax) {
					len = offsetMax;
				}
			
				for (var i = offset; i < len; i += 1) {
					var rating = results[i];
					drink_ids.push(rating.drink_id);
	  			response.ratings.push(rating);
				}	
  			
  		}
  		
  		if (response.ratings.length > 0) {
				var drinksQuery = addSearch({ _id: { $in: drink_ids } }, options);
				response.drinks = Drinks.find( drinksQuery ).fetch();			
			}  		
  		
  	}
  	
  	return response;
	}
	
});

var addSearch = function(query, options) {
	
	/*
	if (options['search']) {	
		
		var newQuery = { $and: [ query, { keywords: {
    	$regex: '.*' + options['search'] + '.*',
    	$options: 'i'
		} } ]}	
			
		return newQuery;	
	}*/
	
	return query;

};