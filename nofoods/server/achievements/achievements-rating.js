var UPDATE_METHODS = typeof UPDATE_METHODS === 'undefined' ? {} : UPDATE_METHODS;

UPDATE_METHODS['RATING'] = function(code) {

	var self = this,
			returned = {},
			parentAchievement = achievements[code];
			
	if (typeof this === 'undefined' || !self.valueOf()) {		
		
		var tier = parentAchievement.tiers[0];
		
		self = createAchievement(code);
		self.tierLevel = 0;
		self.progress	= {
			current: 1,
			cap: tier.cap
		};
		
		self.description = self.description.replace('%cap', tier.cap);
		
		if (tier.description)
			self.description = tier.description;
		if (tier.title)
			self.title = tier.title;
		
		returned.nextAchievement = false;		
		
	} else {
		
		// Increment the value.
		self.progress.current += 1;
		
	}
	
	// Done!	
	if (self.progress.current === self.progress.cap) {
		
		self.date = new Date();
		
	} else if (self.progress.current > self.progress.cap && parentAchievement.tiers) {
		
		var nextLevel = self.tierLevel += 1,
				tier = parentAchievement.tiers[nextLevel],
				len = parentAchievement.tiers.length;
				
		// If not the last make a new achievement		
		if (nextLevel < len) {
		
			var newAchievement = createAchievement(code);
			
			newAchievement.tierLevel = nextLevel;
			
		 	newAchievement.progress	= {
				current: self.progress.current,
				cap: tier.cap
			};
			
			newAchievement.description = newAchievement.description.replace('%cap', tier.cap);
			
			if (tier.description)
				newAchievement.description = tier.description;
			if (tier.title)
				newAchievement.title = tier.title;
			
			if (newAchievement.progress.current === newAchievement.progress.cap) {
		
				newAchievement.date = new Date();
				
			}		
			
			returned.nextAchievement = newAchievement;		
		
		}			
		
	}	
	
	returned.updated = self;
	
	return returned;

};

/**
 * Increment when any new ratings occur.
 */
AddAchievement('COUNT_A', "Rate Something", 'Rate %cap different food items.', 'RATING', 1, [
	{cap: 1, title: 'Rate your first item', description: 'Rate a single food item.'},
	{cap: 2, title: 'Novice Rater' },
	{cap: 4, title: 'Rate your first item 3' },
	{cap: 10, title: 'Rate your first item 4' },
	{cap: 5, title: 'Rate your first item 5' },
	{cap: 6, title: 'Rate your first item 6' },
	{cap: 9001, title: 'Rate your first item' }
]);

/**
 * Increment when any new ratings occur on food.
 */
AddAchievement('COUNT_F', "Rate Something", 'Rate %cap different food items.', 'RATING', 1, [
	{cap: 1, title: 'Rate your first item', description: 'Rate a single food item.'},
	{cap: 2, title: 'Novice Rater' },
	{cap: 4, title: 'Rate your first item 3' },
	{cap: 10, title: 'Rate your first item 4' },
	{cap: 5, title: 'Rate your first item 5' },
	{cap: 6, title: 'Rate your first item 6' },
	{cap: 9001, title: 'Rate your first item' }
]);

/**
 * Increment when any new ratings occur on drinks.
 */
AddAchievement('COUNT_D', "Rate Something", 'Rate %cap different food items.', 'RATING', 1, [
	{cap: 1, title: 'Rate your first item', description: 'Rate a single food item.'},
	{cap: 2, title: 'Novice Rater' },
	{cap: 4, title: 'Rate your first item 3' },
	{cap: 10, title: 'Rate your first item 4' },
	{cap: 5, title: 'Rate your first item 5' },
	{cap: 6, title: 'Rate your first item 6' },
	{cap: 9001, title: 'Rate your first item' }
]);

/**
 * Increment when any update ratings occur.
 */
AddAchievement('COUNT_UD', "Undecided", 'Rate %cap different food items.', 'RATING', 1, [
	{cap: 1, title: 'Rate your first item', description: 'Rate a single food item.'},
	{cap: 2, title: 'Novice Rater' },
	{cap: 4, title: 'Rate your first item 3' },
	{cap: 10, title: 'Rate your first item 4' },
	{cap: 5, title: 'Rate your first item 5' },
	{cap: 6, title: 'Rate your first item 6' },
	{cap: 9001, title: 'Rate your first item' }
]);
