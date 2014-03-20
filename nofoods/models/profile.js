var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

Meteor.methods({
	
	updateProfile: function (options) {
		check(options, {
      name: Match.Optional(NonEmptyString)
    });

		Meteor.users.update({_id: this.userId}, { $set: { "profile.name": options.name } });

	}

});