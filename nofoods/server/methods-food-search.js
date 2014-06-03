var LETTER_NUMBER_REGEX = /^[0-9a-z\s]+$/i;

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.trim().length !== 0 && LETTER_NUMBER_REGEX.test(x);
});

Meteor.methods({
	
	foodSearch: function(options) {
		
		check(options, {
      'search': String
    });
	
		var response = {},
				tokens = options['search'].toLowerCase().split(" "),
				length = 0,
				rCountPrev = -1;

		var filter = {
			limit: 100
		};		
	
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
	
	}

});