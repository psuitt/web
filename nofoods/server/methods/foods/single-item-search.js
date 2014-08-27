Meteor.methods({
	
	getItemById: function (options) {
		
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
		
		filter = _.extend(filter, NoFoodz.consts.filters.HIDDEN_FOODS);
			
		switch (options.type) {
			case "food":
				response.item = Foods.findOne( query, filter );
				if (this.userId)
					response.userRating = Ratings.findOne({
						user_id: this.userId,
						food_id: options._id
					}, { fields: {rating: 1} });
				break;
			case "drink":
				response.item = Drinks.findOne( query, filter );
				if (this.userId)
					response.userRating = Ratings.findOne({
						user_id: this.userId,
						drink_id: options._id
					}, { fields: {rating: 1} });
				break;
			default:
				throw new Meteor.Error(501, "The server does not support this functionality");
		}	 		
  		
  	return response;
	}
	
});