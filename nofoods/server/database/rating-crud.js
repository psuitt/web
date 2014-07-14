NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

NoFoods.rating = function() {

	var _create = function(json, user_id) {
		
		var rating_Id = Ratings.insert(json);
		
		if (user_id) {
			
			var	user = Meteor.users.findOne( {_id: user_id} );
			var achievements = false;
			
			if (json.food_id) {
				achievements = NoFoods.achievements.updateAchievement(['COUNT_A', 'COUNT_F'], user.profile.achievements).updatedList;			
			} else {
				achievements = NoFoods.achievements.updateAchievement(['COUNT_A', 'COUNT_D'], user.profile.achievements).updatedList;			
			}

			if (achievements)
				Meteor.users.update({_id: user_id}, { $set: { "profile.achievements": achievements } } );
			
		}
			
		return rating_Id;
	
	}; 
	
	var _updateOne = function(_id, update, user_id) {
		
		Ratings.update(_id, update);
		
		if (user_id) {
			
			var	user = Meteor.users.findOne( {_id: user_id} );
			var achievements = false;
			
			if (json.food_id) {
				achievements = NoFoods.achievements.updateAchievement(['COUNT_UD'], user.profile.achievements).updatedList;			
			} else {
				achievements = NoFoods.achievements.updateAchievement(['COUNT_UD'], user.profile.achievements).updatedList;			
			}

			if (achievements)
				Meteor.users.update({_id: user_id}, { $set: { "profile.achievements": achievements } } );
			
		}
	
	}; 

	return {
		
		create: function(json, user_id) {
			return _create(json, user_id);
		},
		
		updateOne: function(_id, update, user_id) {
			return _updateOne(_id, update, user_id);
		}
		
	};

}();