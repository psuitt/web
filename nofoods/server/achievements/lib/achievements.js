NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

var achievements = {};
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
	
	achievements[code] = achievement;
	
};

AddAchievement('NEW', "Noob", 'Create an account.', 'NONE', 0);

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
					nextAchievement: newAchievement
				};				
			
			}				
			
			return UPDATE_METHODS[aType].call(achievement, code);	
						
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
			} else {
				list.push(update.updated);			
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

var createAchievement = function(code) {

	var oldAchievement = achievements[code];
				
	var newAchievement = {
		code: oldAchievement.code,
		description: oldAchievement.description
	};	

	return newAchievement;

};

