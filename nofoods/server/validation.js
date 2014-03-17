Meteor.methods({

	validate: function(words) {
		if (Words.findOne( { word: { $in: words } } )) {
			throw new Meteor.Error(400, "Invalid text");
		}
		return true;
	}

});
