Meteor.methods({
	
	findReportedItems: function (options) {
		
		check(options, {
			page: PageNumber,
      count: Match.Optional(Boolean)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, 'You must be logged in');
      
    var user = Meteor.user();  
      
    if (!user.admin !== NoFoodz.consts.admin.SUPER)
      throw new Meteor.Error(403, 'You must be logged in');
      
    var query = {
    	 flags: { $in: [NoFoodz.consts.flags.REPORTED] }
    };
		
		var filter = {
			limit: 10,
			fields: {
				name: 1,
				brand_view: 1			
			}
		};
		
		// Return a reponse of reported items
		response.foods = Foods.find( query, filter ).fetch();
		response.drinks = Foods.find( query, filter ).fetch();

	},
	
	removeItems: function (options) {
		
		check(options, {
			items: NullCheck
    });
    
    for (var i = 0, len = options.items.length; i < len; i += 1) {
    	var item = options.items[i];
    	check(item, NullCheck); 
			check(item._id, NonEmptyStringNoSpaceCharacters); 
			check(item.type, FoodTypeCheck);    
    }
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
		
		var user = Meteor.user();  
      
    if (!user.admin !== NoFoodz.consts.admin.SUPER)
      throw new Meteor.Error(403, "You must be logged in");
		
		for (var i = 0, len = options.items.length; i < len; i += 1) {
    	var item = options.items[i];
    	var ratingRemoveObj = false;
    	var brand_id = false;
    	var Items = false;
    	
    	switch(item.type) {
    	
    		case NoFoodz.consts.db.FOOD:
    			var food = Foods.findOne({ _id : item._id });
    			if (food) {
						ratingRemoveObj = { food_id : food._id };	
						brand_id = food.brand_id;	  
						Items = Foods;  			
    			}
    			break;
    		case NoFoodz.consts.db.DRINK:
    			var drink = Drinks.findOne({ _id : item._id });
    			if (drink) {
						ratingRemoveObj = { drink_id : drink._id };	
						brand_id = drink.brand_id;
						Drinks = Foods;
						Drinks.remove({ _id : item._id }); 	    			
    			}
    			break;
    			
    	};
    	
    	// Remove the ratings.
    	if (ratingRemoveObj && Items) {
				NoFoodz.rating.remove(ratingRemoveObj);  
				Items.remove({ _id : item._id });	
    	}
    	
    	var brandCount = Ratings.find({ brand_id : brand_id}).count();	
    	// Remove the brand if there are no more rating attached.
    	if (brandCount === 0) {
				Brands.remove({ _id: brand_id });    	
    	}
    	 
    }
		
		// Delete all ratings
		
		// Delete the item
		
		// Brand

	}
	
});