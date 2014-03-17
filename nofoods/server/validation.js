Meteor.methods({

	validate: function(words) {
		check(words, Array);

		for (var i = 0, l = words.length; i < l ; i += 1)
			check(words[i], String);

		if (Words.findOne( { word: { $in: words } } )) {
			throw new Meteor.Error(400, "Invalid text");
		}
		return true;
	}

});
