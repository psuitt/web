Meteor.publish("foods_item", function (id) {
	check(id, String);
  return Foods.find({_id: id});
});

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

Meteor.publish("drinks_item", function (id) {
	check(id, String);
  return Drinks.find({_id: id});
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

Meteor.publish("ratings_myfood", function (food_id) {
	check(food_id, String);
  return Ratings.find({food_id: food_id, user_id: this.userId});
});

Meteor.publish("ratings_mydrink", function (drink_id) {
	check(drink_id, String);
  return Ratings.find({drink_id: drink_id, user_id: this.userId});
});
