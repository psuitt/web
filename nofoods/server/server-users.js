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