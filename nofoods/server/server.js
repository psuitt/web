Meteor.publish("foods_toprated", function () {
	var filter = {
			sort: {
				rating_calc: -1,
				ratingcount_calc: -1
			},
			limit: 25
			}
  return Foods.find( { }, filter );
});

Meteor.publish("drinks_toprated", function () {
	var filter = {
			sort: {
				rating_calc: -1,
				ratingcount_calc: -1
			},
			limit: 25
			}
  return Drinks.find( { }, filter );
});
