// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

Meteor.publish("foods", function () {
  return Foods.find({});
});

Meteor.publish("foods_item", function (id) {
	check(id, String);
  return Foods.find({_id: id});
});

Meteor.publish("foods_items", function (ids) {
	check(ids, Array);
  return Foods.find( { _id: { $in: ids } } );
});

Meteor.publish("foods_brand", function (id) {
	check(id, String);
  return Foods.find( { brand_id: id } );
});

Meteor.publish("foods_toprated", function () {
	var filter = {
			sort: {rating_calc: -1},
			limit: 20
			}
  return Foods.find( { }, filter );
});

Meteor.publish("foods_search", function (search) {
	
	check(search, String);
	
	var tokens = search.toLowerCase().split(" "),
			length = 0,
			rCountPrev = -1;

	for (var i, l = tokens.length ; i < l ; i += 1) {
		
		var subArray = tokens.slice(0, (l - i)),
				returned = Foods.find( { keywords: { $all: subArray } } ),
				rCount = returned.count();

		if (rCount > 10 || rCountPrev >= rCount) {

			return returned;	
	
		} else if (i > 0) {

			subArray = tokens.slice(i, l);
			returned = Foods.find( { keywords: { $all: subArray } } );
			rCount = returned.count();

			if (rCount > 10 || rCountPrev >= rCount) {
				return returned;		
			}

		}

		rCountPrev = rCount;

	}

  return Foods.find( { keywords: { $in: tokens } } );

});

Meteor.publish("drinks_item", function (id) {
	check(id, String);
  return Drinks.find({_id: id});
});

Meteor.publish("drinks_items", function (ids) {
	check(ids, Array);
  return Drinks.find( { _id: { $in: ids } } );
});

Meteor.publish("drinks_brand", function (id) {
	check(id, String);
  return Drinks.find( { brand_id: id } );
});

Meteor.publish("drinks_search", function (search) {
	
	check(search, String);
	
	var tokens = search.toLowerCase().split(" "),
			length = 0,
			rCountPrev = -1;

	for (var i, l = tokens.length ; i < l ; i += 1) {
		
		var subArray = tokens.slice(0, (l - i)),
				returned = Drinks.find( { keywords: { $all: subArray } } ),
				rCount = returned.count();

		if (rCount > 10 || rCountPrev >= rCount) {

			return returned;	
	
		} else if (i > 0) {

			subArray = tokens.slice(i, l);
			returned = Drinks.find( { keywords: { $all: subArray } } );
			rCount = returned.count();

			if (rCount > 10 || rCountPrev >= rCount) {
				return returned;		
			}

		}

		rCountPrev = rCount;

	}

  return Drinks.find( { keywords: { $in: tokens } } );

});

Meteor.publish("ratings_my", function () {
	if (this.userId) 
  	return Ratings.find({user_id: this.userId}, {sort: {date: -1}});
  this.ready();
});

Meteor.publish("ratings_my_food_page", function (page) {
	check(page, Number);
	if (this.userId) {
  	return Ratings.find(
  		{user_id: this.userId}, 
  		{ sort: {date: -1},
  			skip: 1*page,
  			limit: 1
  		});
  }
  this.ready();
});

Meteor.publish("ratings_food", function (food_id) {
	check(food_id, String);
  return Ratings.find({food_id: food_id});
});

Meteor.publish("ratings_myfood", function (food_id) {
	check(food_id, String);
  return Ratings.find({food_id: food_id, user_id: this.userId});
});

Meteor.publish("ratings_drink", function (drink_id) {
	check(drink_id, String);
  return Ratings.find({drink_id: drink_id});
});

Meteor.publish("ratings_mydrink", function (drink_id) {
	check(drink_id, String);
  return Ratings.find({drink_id: drink_id, user_id: this.userId});
});

Meteor.publish("ratings_user", function (userId) {
	check(userId, String);
  return Ratings.find({user_id: userId}, {sort: {date: -1}});
});

Meteor.publish("brands_items", function (ids) {
	check(ids, Array);
  return Brands.find( { _id: { $in: ids } } );
});

Meteor.publish("words", function () {
  return Words.find({});
});

