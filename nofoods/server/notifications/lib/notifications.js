NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.notifications = function () {

	var _notification = function(options) {
	
		var notification = {
			date: options.date		
		};	
	
	};

	var _notify = function(user_id, notification) {
	
		var filter = {
			fields: {
				notifications: 1			
			}
		};	
	
		var notifyingUser = Meteor.users.findOne( {
			 _id: user_id,
			 }, filter );
			 
		if (notifyingUser && notifyingUser.notifications) {

			_.each(notifyingUser.notifications, function(element, index, list) {
				Meteor.users.update({_id: element.user_id}, { 
					$push: { "profile.notifications": {
						$each: [notification],
						$slice: -15
						} } 
				});
			});
		
		}	
	
	};

	return {
		notify: function(user_id, notification) { _notify(user_id, notification); },
		createNotification: function(options) { return _notification(options); }
	};

}();