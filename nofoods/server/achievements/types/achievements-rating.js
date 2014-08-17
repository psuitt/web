UPDATE_METHODS['RATING'] = function(code) {

	var self = this,
			returned = {},
			parentAchievement = Achievements[code];
			
	if (typeof this === 'undefined' || !self.valueOf()) {		
		
		var tier = parentAchievement.tiers[0];
		
		self = CreateAchievement(code);
		self.tierLevel = 0;
		self.progress	= {
			current: 1
		};
		
		self = _.extend(self, tier);
		self.description = self.description.replace('%cap', tier.cap);
		
		returned.nextAchievement = self;		
		
	} else {
		
		// Increment the value.
		self.progress.current += 1;
		
	}
	
	// Done!	
	if (self.progress.current === self.cap) {
		
		self.date = new Date();
		
	} else if (self.progress.current > self.cap && parentAchievement.tiers) {
		
		var nextLevel = self.tierLevel + 1,
				tier = parentAchievement.tiers[nextLevel],
				len = parentAchievement.tiers.length;
				
		// If not the last make a new achievement		
		if (nextLevel < len) {
		
			var newAchievement = CreateAchievement(code);
			
			newAchievement.tierLevel = nextLevel;
			
		 	newAchievement.progress	= {
				current: self.progress.current
			};
			
			newAchievement = _.extend(newAchievement, tier);
			newAchievement.description = newAchievement.description.replace('%cap', tier.cap);
			
			if (newAchievement.progress.current === newAchievement.cap) {
		
				newAchievement.date = new Date();
				
			}		
			
			returned.nextAchievement = newAchievement;		
		
		}			
		
	}	
	
	returned.updated = self;
	
	return returned;

};