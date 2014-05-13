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

Meteor.methods({
	
	getUserFoodRatings: function (page) {
		
		check(page, Number);
		
		var response = false;
		
		var query = {
			user_id: this.userId,
			food_id: { $exists: true }
		};
		
		var filter = {
			sort: {date: -1},
			skip: 2*page,
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
	}
	
});