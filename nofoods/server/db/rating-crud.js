NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.rating = function() {

	var _create = function(json) {
		
		var rating_Id = Ratings.insert(json);
		var user_id = json.user_id;
		var	user = Meteor.users.findOne( {_id: user_id}, {
			fields: {
				achievements: 1				
			}
		} );
		
		var achievements = false;
		
		if (json.food_id) {
			achievements = NoFoods.achievements.updateAchievement(['COUNT_A', 'COUNT_F'], user.achievements).updatedList;			
		} else {
			achievements = NoFoods.achievements.updateAchievement(['COUNT_A', 'COUNT_D'], user.achievements).updatedList;			
		}

		if (achievements)
			Meteor.users.update({_id: user_id}, { $set: { "achievements": achievements } } );
			
		var noti = NoFoodz.notifications.create(NoFoodz.notifications.types.RATING, json);
		NoFoodz.notifications.notify(user_id, noti);
			
		return rating_Id;
	
	}; 
	
	var _updateOne = function(ratingUpdate, update, user_id) {
		
		var _id = ratingUpdate._id;		
		
		Ratings.update(_id, update);
		
		if (user_id) {
			
			var	user = Meteor.users.findOne( {_id: user_id}, {
				fields: {
					achievements: 1				
				}
			} );
			var achievements = false;
			
			if (ratingUpdate.food_id) {
				achievements = NoFoods.achievements.updateAchievement(['COUNT_UD'], user.achievements).updatedList;			
			} else {
				achievements = NoFoods.achievements.updateAchievement(['COUNT_UD'], user.achievements).updatedList;			
			}

			if (achievements)
				Meteor.users.update({_id: user_id}, { $set: { "achievements": achievements } } );
			
		}
	
	}; 
	
	var _remove = function(json) {
		
		if (json.food_id) {
			Ratings.remove({ food_id : json.food_id});			
		} else if (json.drink_id) {
			Ratings.remove({ drink_id : json.drink_id});						
		}

	
	}; 

	return {
		
		create: function(json, user_id) {
			return _create(json, user_id);
		},
		
		updateOne: function(_id, update, user_id) {
			return _updateOne(_id, update, user_id);
		},
		
		remove: function(json) {
			return _remove(json);
		}
		
	};

}();