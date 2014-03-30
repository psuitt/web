Statistics = new Meteor.Collection("statistics");

Statistics.allow({
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

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

Meteor.methods({

	addCountry: function(options) {
	
		check(options, {
      country: NonEmptyString
    });
    
    var statistics_id = Statistics.insert({
				_id: Random.id(),
				counties: options._id,
				user_id: this.userId, 
				rating: options.rating,
				date: Date.now()
		});
		
		Meteor.users.update({_id: this.userId}, { $addToSet: { "profile.links": link } });
	
	}

});