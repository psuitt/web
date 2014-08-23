var reportCheck = Match.Where(function (x) {
  check(x, String);
  return x === "drink" || x === "food" || x === "brand";
});

Meteor.methods({
	
	reportInappropriate: function (options) {
		
		check(options, {
      _id: NonEmptyStringNoSpaceCharacters,
      type: reportCheck
    });
 
		if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
		
		var response = {};
		
		var query = {
			_id: options._id
		};
		
		var filter = {
			sort: {name: -1}
		};			
			
		switch (options.type) {
			case "food":
				Foods.update(options._id, 
					{
						$addToSet: { 
							flags: NoFoodz.consts.flags.REPORTED,
							reporters: this.userId 
						},
						$inc: { reporters_len: 1 } 
					} 
				);
				break;
			case "drink":
				Drinks.update(options._id, 
					{
						$addToSet: { 
							flags: NoFoodz.consts.flags.REPORTED,
							reporters: this.userId 
						},
						$inc: { reporters_len: 1 } 
					} 
				);
				break;
			case "brand":
				Brands.update(options._id, 
					{
						$addToSet: { 
							flags: NoFoodz.consts.flags.REPORTED,
							reporters: this.userId 
						},
						$inc: { reporters_len: 1 }
					} 
				);
				break;
			default:
				throw new Meteor.Error(501, "The server does not support this functionality");
		}	 		
		
	}	
	
});
