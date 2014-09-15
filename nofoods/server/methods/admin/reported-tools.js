var MAX_LIMIT = 15;

Meteor.methods({
	
	findReportedItems: function (options) {
		
		check(options, {
			page: PageNumber,
      count: Match.Optional(Boolean)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, 'You must be logged in');
      
    var user = Meteor.user(); 
    
    if (!user.admin || user.admin !== NoFoodz.consts.admin.SUPER)
      throw new Meteor.Error(403, NoFoodz.messages.errors.ADMIN_TYPE);
      
    var query = {
    	 flags: { $in: [NoFoodz.consts.flags.REPORTED] }
    };
		
		var filter = {
			limit: MAX_LIMIT,
			skip: MAX_LIMIT*(options.page - 1),
			fields: {
				name: 1,
				brand_id: 1,
				brand_view: 1			
			}
		};
		
		var response = {};
		
		// Return a reponse of reported items
		response.foods = Foods.find( query, filter ).fetch();
		response.drinks = Drinks.find( query, filter ).fetch();
		
		return response;

	},
	
	removeItems: function (options) {
		
		check(options, {
			items: Array
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
      
    if (!user.admin || user.admin !== NoFoodz.consts.admin.SUPER)
      throw new Meteor.Error(403, NoFoodz.messages.errors.ADMIN_TYPE);
		
		for (var i = 0, len = options.items.length; i < len; i += 1) {
    	var item = options.items[i];
    	var ratingRemoveObj = false;
    	var brand_id = false;
    	var Items = false;
    	
    	switch(item.type) {
    	
    		case NoFoodz.consts.db.FOOD:
    			var food = Foods.findOne({ _id : item._id });
    			if (food) {
						brand_id = food.brand_id;	    			
    			}
    			Items = Foods;
    			ratingRemoveObj = { food_id : food._id };
    			break;
    		case NoFoodz.consts.db.DRINK:
    			var drink = Drinks.findOne({ _id : item._id });
    			if (drink) {
						brand_id = drink.brand_id;	    			
    			}
    			Items = Drinks;	
    			ratingRemoveObj = { drink_id : drink._id };
    			break;
    			
    	};
    	
    	// Remove the ratings.
    	if (ratingRemoveObj && Items) {
				NoFoodz.rating.remove(ratingRemoveObj);  
				Items.remove({ _id : item._id });	
    	}
    	
    	var brandCount = Foods.find({ brand_id : brand_id}).count() 
    	+ Drinks.find({ brand_id : brand_id}).count();	
    	
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