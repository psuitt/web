Meteor.methods({
	
	updateFoodDrinkInfo: function (options) {
		
		check(options, {
			_id: NonEmptyStringNoSpaceCharacters,
      type: FoodTypeCheck,
      info: InfoCheck
    });
    
    for (var prop in options.info) {
      // important check that this is objects own property 
      // not from prototype prop inherited
      if(options.info.hasOwnProperty(prop)){
        if (prop in InfoCheckMap) {
					check(options.info[prop], InfoCheckMap[prop]);
        } else {
        	check(options.info[prop], NoFoodzString);
        }
      }
   }
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

		var item;

		switch (options.type) {
			case "food":
			
				item = Foods.findOne({_id: options._id});

				if (item.user_id !== this.userId)		
					throw new Meteor.Error(403, "You do not have permissions to update this");	
					
				Foods.update({_id: options._id}, { $set: { "info": options.info } } );	
				
				break;
			case "drink":
			
				item = Drinks.findOne({_id: options._id});

				if (item.user_id !== this.userId)		
					throw new Meteor.Error(403, "You do not have permissions to update this");					
				
				Drinks.update({_id: options._id}, { $set: { "info": options.info } } );					
				
				break;
			default:
				throw new Meteor.Error(501, "The server does not support this functionality");
		}

	}
	
});
