// Deny all user updates.
Meteor.users.deny({
 insert: function () { return true; },
 update: function () { return true; },
 remove: function () { return true; }
});

//Search user names
Meteor.publish("userdata", function () {
  if (this.userId) {
	
		var query = {
			_id : this.userId
		};
		var filter = {
			fields: {
				username: 1,
				profile: 1			
			}
		};
  	return Meteor.users.find(query, filter);
  } else {
    this.ready();
  }
});

//Search user names
Meteor.publish("users_search", function (username) {
  if (this.userId) {
		check(username, String);
	
		var query = {
		username : {
    	$regex: ".*" + username + ".*",
    	$options: 'i'
			}
		};
		var filter = {
			fields: {username: 1},
			sort: {username: 1},
			limit: 20
			};
  	return Meteor.users.find(query, filter);
  } else {
    this.ready();
  }
});

Meteor.publish("users_searchexact", function (username) {
  if (this.userId) {
		check(username, String);
	
		var query = {
			username : username
		};
		
		var filter = {
			fields: {
				username: 1,
				"profile.name": 1
				}
			};
		
  	return Meteor.users.find(query, filter);
  } else {
    this.ready();
  }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.trim().length !== 0;
});

Meteor.methods({
	
	getUserFoodRatings: function (options) {
		
		check(options, {
      page: Number,
			user_id: Match.Optional(NonEmptyString)
    });
		
		var response = false,
				page = options.page;
		
		var query = {
			user_id: options.user_id ? options.user_id : this.userId,
			food_id: { $exists: true }
		};
		
		var filter = {
			sort: {date: -1},
			skip: 2*(page - 1),
			limit: 2
		};		
		
		if (this.userId) {
			var food_ids = [];

			response = {
				ratings: []
			};		
			
  		Ratings.find(query, filter).forEach(function (rating) {
  			food_ids.push(rating.food_id);
  			response.ratings.push(rating);
  		});

			if (response.ratings.length > 0) {
				response.foods = Foods.find( { _id: { $in: food_ids } } ).fetch();			
			}  		
  		
  	}
  	
  	return response;
	},
	
	getUserDrinkRatings: function (options) {
		
		check(options, {
      page: Number,
			user_id: Match.Optional(NonEmptyString)
    });
		
		var response = false,
				page = options.page;
		
		var query = {
			user_id: options.user_id ? options.user_id : this.userId,
			drink_id: { $exists: true }
		};
		
		var filter = {
			sort: {date: -1},
			skip: 2*(page - 1),
			limit: 2
		};		
		
		if (this.userId) {
			
			var drink_ids = [];

			response = {
				ratings: []
			};		
			
  		Ratings.find(query, filter).forEach(function (rating) {
  			drink_ids.push(rating.drink_id);
  			response.ratings.push(rating);
  		});

			if (response.ratings.length > 0) {
				response.drinks = Drinks.find( { _id: { $in: drink_ids } } ).fetch();			
			}  		
  		
  	}
  	
  	return response;
	}
	
});