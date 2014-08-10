Meteor.methods({
	
	getFoodDrinkByBrand: function (options) {
		
		check(options, {
      brand_id: Match.Optional(NonEmptyStringNoSpaceCharacters)
    });
		
		var response = {};
		
		var query = {
			brand_id: options.brand_id
		};
		
		var filter = {
			sort: {name: -1}
		};			
			
		response.drinks = Drinks.find( query, filter ).fetch();	
		response.foods = Foods.find( query, filter ).fetch();		 		
  		
  	return response;
	}
	
});