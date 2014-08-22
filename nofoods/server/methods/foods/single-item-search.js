Meteor.methods({
	
	getFoodDrinkById: function (options) {
		
		check(options, {
      _id: NonEmptyStringNoSpaceCharacters,
      type: FoodTypeCheck
    });
		
		var response = {};
		
		var query = {
			_id: options._id
		};
		
		var filter = {
			sort: {name: -1}
		};			
			
		switch (options.type) {
			case "food":
				response = Foods.findOne( query, filter );
				break;
			case "drink":
				response = Drinks.findOne( query, filter );
				break;
			default:
				throw new Meteor.Error(501, "The server does not support this functionality");
		}	 		
  		
  	return response;
	}
	
});