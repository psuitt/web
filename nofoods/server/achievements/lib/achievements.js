NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

Achievements = {};
UPDATE_METHODS = {};

AddAchievement = function(code, title, description, type, difficulty, tiers) {
	
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
	
	if (!Achievements[code]) {
		Achievements[code] = achievement;
	} else {
		throw new Meteor.Error(500, "Duplicate achievement code set for code = [" + code + "].");
	}
	
};

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
	
		if (code in Achievements) {
			
			var aType = Achievements[code].type;
				
			if ( aType === 'NONE' ) {
			
				var newAchievement = CreateAchievement(code);
				
				newAchievement.date = new Date();
			
				return {
					updated: newAchievement, 
					nextAchievement: newAchievement
				};				
			
			}				

			return UPDATE_METHODS[aType].call(achievement, code);	
						
		}	
	
	};
	
	var _updateAchievements = function(codeList, list) {
	
		var updates = [];
		
		if (!list)
			list = [];	
	
		for (var i = 0, l = codeList.length; i < l; i += 1) {

			var aIndex = _getAchievementLastIndex(list, codeList[i]),
					oldAchievement = false;			
		
			if (aIndex) {
				oldAchievement = list[aIndex];			
			}	
			
			var update = _handleSingleUpdate(codeList[i], oldAchievement);
			
			if (update.nextAchievement)	{
				list.push(update.nextAchievement);			
			}	else if (aIndex && update.updated) {
				list[aIndex] = update.updated;			
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

CreateAchievement = function(code) {

	var oldAchievement = Achievements[code];
				
	var newAchievement = {
		code: oldAchievement.code,
		title: oldAchievement.title,
		description: oldAchievement.description,
		type: oldAchievement.type,
		difficulty: oldAchievement.difficulty,
		tierLevel: oldAchievement.tierLevel
	};	

	return newAchievement;

};

