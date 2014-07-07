NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

NoFoods.rating = function() {

	var _create = function(json, user_id) {
		
		var rating_Id = Ratings.insert(json);
		
		if (user_id) {
			
			var	user = Meteor.users.findOne( {_id: user_id} );
			var achievements = NoFoods.achievements.updateAchievement('COUNT_F', user.profile.achievements).updatedList;			

			Meteor.users.update({_id: user_id}, { $set: { "profile.achievements": achievements } } );
			
		}
			
		return rating_Id;
	
	}; 
	
	var _updateOne = function(_id, update) {
		
		Ratings.update(_id, update);
	
	}; 

	return {
		
		create: function(json, user_id) {
			return _create(json, user_id);
		},
		
		updateOne: function(_id, update) {
			return _updateOne(_id, update);
		}
		
	};

}();