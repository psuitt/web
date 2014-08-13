Meteor.methods({
	
	updateProfile: function (options) {
		check(options, {
      name: Match.Optional(NonEmptyString)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		if (!options.name) {
			return;
		}

		var update = {
			"profile.name": options.name
		};

		Meteor.users.update({_id: this.userId}, { $set: update });

	},

	addToWishList: function (options) {
		
		check(options, {
      food_id: Match.Optional(NonEmptyString),
			drink_id: Match.Optional(NonEmptyString)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
		
		var query = {
			_id: this.userId, 
			"profile.wishlist.food_id": options.food_id,
			"profile.wishlist.drink_id": options.drink_id
		};

		var findOne = Meteor.users.findOne(query);

		if (!findOne) {
			
			var wish = {
				food_id: options.food_id,
				drink_id: options.drink_id,
				date: Date.now()
			};
			
			Meteor.users.update({_id: this.userId}, { $addToSet: { "profile.wishlist": wish } });
		}

	},
	
	removeFromWishList: function (options) {
		
		check(options, {
      food_id: Match.Optional(NonEmptyString),
			drink_id: Match.Optional(NonEmptyString)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
      
		if (!options.food_id && !options.drink_id) 
			throw new Meteor.Error(500, "A food or drink must be removed from the wishlist");
		    
      
    var toRemove = {};
    
    if (options.food_id) {
			toRemove.food_id = options.food_id;   
    } else {
    	toRemove.drink_id = options.drink_id;
    }
		
		Meteor.users.update({_id: this.userId}, { $pull: { "profile.wishlist": toRemove } });

	},
	
	addToLinks: function (options) {
		
		check(options, {
      username: NonEmptyString
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in to perform this function");
		
		var query = {
			_id: this.userId, 
			"profile.links.username": options.username
		};
		
		var findOne = Meteor.users.findOne(query);

		if (!findOne) {
			
			var link = {
				username: options.username,
				date: Date.now()
			};
			
			Meteor.users.update({_id: this.userId}, { $push: { "profile.links": link } });
			
		}
		
		var notification = {
			user_id: this.userId
		};
		
		Meteor.users.update({username: options.username}, { $addToSet: { "notifications": notification } });	

	},

	removeFromLinks: function (options) {
		
		check(options, {
      username: NonEmptyString
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in to perform this function");
		
		Meteor.users.update({_id: this.userId}, { $pull: { "profile.links": { username: options.username } } });
		Meteor.users.update({username: options.username}, { $pull: { "notifications": { user_id: this.userId } } });

	},
	
	getUserWishlist: function (options) {
		
		check(options, {
      page: PageNumber,
      count: Match.Optional(Boolean),
			user_id: Match.Optional(NonEmptyString),
			search: Match.Optional(NonEmptyString)
    });
		
		var response = false,
				page = options.page;
		
		if (this.userId) {
			
			var query = {
				_id : this.userId
			};
			
			var filter = {
				sort: {date: -1},
				fields: {
					profile: 1			
				}
			};
			
			var drink_ids = [];
			var food_ids = [];

			response = {
				wishlist: []
			};		
			
			var profile = Meteor.user().profile,
					wishlist = profile.wishlist
					
			if (!wishlist) {
				response.count = 0;
  			response.maxPageSize = PAGE_LIMIT;
				return response;			
			}
			
  		if (options.count) {
				
				// set the total count.
  			response.count = wishlist.length;
  			response.maxPageSize = PAGE_LIMIT;
  			
  		}
  		
  		var offset = PAGE_LIMIT*(page-1),
					offsetMax = PAGE_LIMIT*(page),	
					len = wishlist.length;

			if (len > offsetMax) {
				len = offsetMax;
			}
		
			for (var i = offset; i < len; i += 1) {
				var wish = wishlist[i];
				if (wish.food_id) {
					food_ids.push(wish.food_id)
				} else {
					drink_ids.push(wish.drink_id);
				}
  			response.wishlist.push(wish);
			}	
			
			if (food_ids.length > 0) {
				var foodsQuery = addSearch({ _id: { $in: food_ids } }, options);
				response.foods = Foods.find( foodsQuery ).fetch();		
			} 
  		
			if (drink_ids.length > 0) {
				var drinksQuery = addSearch({ _id: { $in: drink_ids } }, options);;
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