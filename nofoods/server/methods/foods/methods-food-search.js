Meteor.methods({
	
	foodSearch: function(options) {
		
		check(options, {
      'search': NonEmptyString,
      'type': Match.Optional(TypeCheck)
    });
    
    var response = {};
    
    var filter = {
			limit: 100,
			fields: {
				name: 1,
				brand_id: 1,
				brand_view: 1,
				rating_calc: 1			
			}
		};
    
    if (options.type && options.type.toLowerCase() === 'brand') {
			var query = {
				brand_view : {
			    $regex: ".*" + NoFoodz.utils.StripCharacters(options.search) + ".*",
			    $options: 'i'
				}
			};  
			response.data = Foods.find( query, filter ).fetch();
	  	return response;  
    }
	
		var tokens = NoFoodz.utils.Tokenize(options['search']),
				length = 0,
				rCountPrev = -1;
	
		for (var i, l = tokens.length ; i < l ; i += 1) {
			
			var subArray = tokens.slice(0, (l - i)),
					returned = Foods.find( { keywords: { $all: subArray } }, filter ),
					rCount = returned.count();
	
			if (rCount > 10 || rCountPrev >= rCount) {
	
				response.data = returned.fetch();
				return response;	
		
			} else if (i > 0) {
	
				subArray = tokens.slice(i, l);
				returned = Foods.find( { keywords: { $all: subArray } }, filter );
				rCount = returned.count();
	
				if (rCount > 10 || rCountPrev >= rCount) {
					response.data = returned.fetch();
					return response;		
				}
	
			}
	
			rCountPrev = rCount;
	
		}
	
	  response.data = Foods.find( { keywords: { $in: tokens } }, filter ).fetch();
	  return response;
	
	},
	
	drinkSearch: function(options) {
		
		check(options, {
      'search': NonEmptyString,
      'type': Match.Optional(TypeCheck)
    });
    
    var response = {};
    
    var filter = {
			limit: 100,
			fields: {
				name: 1,
				brand_id: 1,
				brand_view: 1,
				rating_calc: 1			
			}
		};
    
    if (options.type && options.type.toLowerCase() === 'brand') {
			var query = {
				brand_view : {
			    $regex: ".*" + NoFoodz.utils.StripCharacters(options.search) + ".*",
			    $options: 'i'
				}
			};  
			response.data = Drinks.find( query, filter ).fetch();
	  	return response;  
    }
	
		var tokens = NoFoodz.utils.Tokenize(options['search']),
				length = 0,
				rCountPrev = -1;	
	
		for (var i, l = tokens.length ; i < l ; i += 1) {
			
			var subArray = tokens.slice(0, (l - i)),
					returned = Drinks.find( { keywords: { $all: subArray } }, filter ),
					rCount = returned.count();
	
			if (rCount > 10 || rCountPrev >= rCount) {
	
				response.data = returned.fetch();
				return response;	
		
			} else if (i > 0) {
	
				subArray = tokens.slice(i, l);
				returned = Drinks.find( { keywords: { $all: subArray } }, filter );
				rCount = returned.count();
	
				if (rCount > 10 || rCountPrev >= rCount) {
					response.data = returned.fetch();
					return response;		
				}
	
			}
	
			rCountPrev = rCount;
	
		}
	
	  response.data = Drinks.find( { keywords: { $in: tokens } }, filter ).fetch();
	  return response;
	
	}

});