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
		
		var query = {
			user_id: this.userId,
			food_id: { $exists: true }
		};
		
		var filter = {
			sort: {date: -1},
			skip: 1*page,
			limit: 1
		};		
		
		if (this.userId) 
  		return Ratings.find(query, filter).fetch();
  	return false;
	}
	
});