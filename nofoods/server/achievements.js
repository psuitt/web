NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

var achievements = {};
var UPDATE_METHODS = {};

var addAchievement = function(code, description, type, caps) {
	
	var achievement = {
		code: code,
		description: description,
		type: type,
		caps: caps
		// Progress
		// Date
	};
	
	achievements[code] = achievement;
	
};

addAchievement('NEW', 'Create an account.', 'NONE');
addAchievement('COUNT_F', 'Rate %cap different food items.', 'RATING', [1, 5, 10, 20, 50, 100]);


// GLOBAL FUNCTIONS

NoFoods.achievements = function() {

	return {
		
		getAchievementLastIndex: function(list, code) {
			
			if (list) {
			
				for (var i = list.length -1; i > -1; i -= 1) {
					if (list[i].code === code) {
						return i;					
					}	
				}
			
			}
			
			return false;			
			
		},
		
		updateAchievement: function(code, achievement) {
			
			if (code in achievements) {
				
				if (achievements[code].type === 'NONE') {
				
					var newAchievement = createAchievement(code);
					
					newAchievement.date = new Date();
				
					return {
						updated: newAchievement, 
						next: false
					};				
				
				}				
				
				return UPDATE_METHODS[code].call(achievement);	
							
			}
		
		}	
	
	};

}();

UPDATE_METHODS['RATING'] = function() {

	var self = this,
			returned = {};
	
	if (typeof self === 'undefined') {
		
		self = createAchievement(code);
		self.progress	= {
			current: 1,
			cap: 5
		};
		self.description = 'Rate a single food item.';
		
		returned.next = false;
		
	} else {
		
		// Increment the value.
		self.progress += 1;
	
		// Done!	
		if (self.progress === self.cap) {
			
			self.date = new Date();
			
		} else if (self.progress.current > self.progress.cap && self.caps) {

			var	len = self.caps.length,
					index = self.caps.indexOf(self.progress.cap);
					
			// If not the last make a new achievement		
			if (index !== (len - 1)) {
			
				var newAchievement = createAchievement(code);
				
				newAchievement.progress	= {
					current: self.progress.current,
					cap: self.caps[(index + 1)]
				};
				newAchievement.description.replace('%cap', self.progress.cap);
				
				returned.next = newAchievement;				
			
			}			
			
		}
	
	}
	
	returned.updated = self;
	
	return returned;

};

var createAchievement = function(code) {

	var oldAchievement = achievements[code];
				
	var newAchievement = {
		code: oldAchievement.code,
		description: oldAchievement.description
	};	

	return newAchievement;

};

