NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.notifications = function () {

	var MAX_NOTIFICATIONS = 8;

	var _types = {
		GENERIC: "generic",
		RATING: "rating"
	};
	
	var _messageMethods = {};
	
	_messageMethods[_types.RATING] = function() {

		var item;
		var href;
		var	user = Meteor.users.findOne( {_id: this.user_id}, {
			fields: {
				username: 1				
			}
		} );
		var filter = {
			fields: {
				name: 1		
			}
		};
	
		if (this.food_id) {
			item = Foods.findOne( { _id: this.food_id}, filter );
			href = NoFoodz.consts.urls.FOOD;
			href += this.food_id;
		} else {
			item = Drinks.findOne( { _id: this.drink_id}, filter );
			href = NoFoodz.consts.urls.DRINK;
			href += this.drink_id;	
		}
		
		var message = '';
		
		message += '<a href=\'';
		message += NoFoodz.consts.urls.PEOPLE;
		message += user.username;
		message += '\'>';
		message += user.username;
		message += '</a>';
		message += ' rated <a href=\'';
		message += href;
		message += '\'>';
		message += item.name;
		message += '</a> ';
		message += this.rating;
		message += ' hearts.';
		
		return message;
	
	};

	var _createNotification = function(type, options) {
	
		var message = options.message;	
	
		if (_messageMethods[type]) {
			message = _messageMethods[type].call(options);		
		}	
	
		var notification = {
			message: message,
			date: new Date()	
		};	
		
		return notification;
	
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
						$slice: -MAX_NOTIFICATIONS
						} } 
				});
			});
		
		}	
	
	};

	return {
		types: function() { return _.extend({}, _types); }(),
		notify: function(user_id, notification) { return _notify(user_id, notification); },
		create: function(type, options) { return _createNotification(type, options); }
	};

}();