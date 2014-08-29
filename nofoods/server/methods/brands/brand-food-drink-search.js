Meteor.methods({
	
	getBrand: function (options) {
		
		check(options, {
      brand_id: Match.Optional(NonEmptyStringNoSpaceCharacters)
    });
		
		var response = {};
		
		var query = {
			brand_id: options.brand_id
		};
		
		var filter = {
			sort: {name: -1},
			fields: {name: -1}
		};			
		
		response.brand = Brands.findOne( {
			_id: options.brand_id
		}, filter );	 		
  		
  	return response;
	},
	
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
		
		response.brand = Brands.findOne( {
			_id: options.brand_id
		}, filter );		
		response.drinks = Drinks.find( query, filter ).fetch();	
		response.foods = Foods.find( query, filter ).fetch();		 		
  		
  	return response;
	}
	
});