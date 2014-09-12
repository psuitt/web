Meteor.methods({
	
	findReportedItems: function (options) {
		
		check(options, {
			page: PageNumber,
      count: Match.Optional(Boolean)
    });
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
		// Check if admin
		
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
			check(item.type, NonEmptyStringNoSpaceCharacters);    
    }
    
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");
		// Check if admin
		
		// Delete all ratings
		
		// Delete the item

	}
	
});