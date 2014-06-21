NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

var achievements = {};
var UPDATE_METHODS = {};

var addAchievement = function(code, title, description, type, difficulty, tiers) {
	
	var achievement = {
		code: code,
		title: title,
		description: description,
		type: type,
		difficulty: difficulty,
		tierLevel: 0,
		tiers: tiers
		// Progress
		// Date
	};
	
	achievements[code] = achievement;
	
};

addAchievement('NEW', "Noob", 'Create an account.', 'NONE', 0);
addAchievement('COUNT_F', "Rate Something", 'Rate %cap different food items.', 'RATING', 1, [
	{cap: 1, title: 'Rate your first item', description: 'Rate a single food item.'},
	{cap: 2, title: 'Novice Rater' },
	{cap: 3, title: 'Rate your first item 3' },
	{cap: 4, title: 'Rate your first item 4' },
	{cap: 5, title: 'Rate your first item 5' },
	{cap: 6, title: 'Rate your first item 6' },
	{cap: 9001, title: 'Rate your first item' }
]);


// GLOBAL FUNCTIONS

NoFoods.achievements = function() {
	
	var _getAchievementLastIndex = function(list, code) {
			
		if (list) {
		
			for (var i = list.length -1; i > -1; i -= 1) {
				if (list[i].code === code) {
					return i;					
				}	
			}
		
		}
		
		return false;			
		
	};
	
	var _handleSingleUpdate = function(code, achievement) {
	
		if (code in achievements) {
			
			var aType = achievements[code].type;
				
			if ( aType === 'NONE' ) {
			
				var newAchievement = createAchievement(code);
				
				newAchievement.date = new Date();
			
				return {
					updated: newAchievement, 
					nextAchievement: false
				};				
			
			}				
			
			return UPDATE_METHODS[aType].call(achievement);	
						
		}	
	
	};
	
	var _updateAchievements = function(codeList, list) {
	
		var updates = [];	
	
		for (var i = 0, l = codeList.length; i < l; i += 1) {

			var aIndex = _getAchievementLastIndex(list, codeList[i]),
					oldAchievement = false;			
		
			if (aIndex) {
				oldAchievement = list[aIndex];			
			}	
			
			var update = _handleSingleUpdate(codeList[i], oldAchievement);
			
			if (aIndex) {
				list[aIndex] = update.updated;			
			}
			
			if (update.nextAchievement)	{
				list.push(update.nextAchievement);			
			}		
			
			updates.push(update);
		
		}

		return { 
			updatedList: list,
			updates: updates
		};
	
	};


	return {
		
		updateAchievement: function(codeOrList, list) {
			
			if ( typeof codeOrList === 'string' ) {
				return _updateAchievements( [ codeOrList ], list);		
			}			
			
			return _updateAchievements( codeOrList, list );
		
		}	
	
	};

}();

UPDATE_METHODS['RATING'] = function() {

	var self = this,
			returned = {},
			parentAchievement = achievements[self.code];
	
	if (typeof this === 'undefined') {
		
		var tier = parentAchievement.tiers[0];		
		
		self = createAchievement(code);
		self.tierLevel = 0;
		self.progress	= {
			current: 1,
			cap: tier.cap
		};
		
		if (tier.description)
			self.description = tier.description;
		if (tier.title)
			self.title = tier.title;
		
		returned.nextAchievement = false;
		
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
				
				newAchievement.tierLevel = self.tierLevel + 1;
				
			 	var tier = parentAchievement.tiers[newAchievement.tierLevel];
				
				newAchievement.progress	= {
					current: self.progress.current,
					cap: self.caps[(index + 1)]
				};
				newAchievement.description.replace('%cap', self.progress.cap);
				
				if (tier.description)
					self.description = tier.description;
				if (tier.title)
					self.title = tier.title;
				
				returned.nextAchievement = newAchievement;				
			
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

