var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

Meteor.methods({
	
	updateProfile: function (options) {
		check(options, {
      name: Match.Optional(NonEmptyString)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		if (options.name) {
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
	
	addToLinks: function (options) {
		
		check(options, {
      username: Match.Optional(NonEmptyString)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
		
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
			
			Meteor.users.update({_id: this.userId}, { $addToSet: { "profile.links": link } });
		}

	}

});