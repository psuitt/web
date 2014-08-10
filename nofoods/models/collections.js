Ratings = new Meteor.Collection("ratings");
Foods = new Meteor.Collection("foods");
Drinks = new Meteor.Collection("drinks");
Brands = new Meteor.Collection("brands");

createFood = function (options, callback) {
  var id = Random.id(),
			response = {};

	response.id = id;

  Meteor.call('createFood', _.extend({ _id: id }, options), function(e) {
		response.error = e;
		callback && callback(response);
	});	

};

updateFood = function (options, callback) {
  var response = {};
  Meteor.call('updateFood', options, function(err, data) {
		response.error = err;
		response.data = data;
		callback && callback(response);
  });
};

updateDrink = function (options, callback) {
	var response = {};
  Meteor.call('updateDrink', options, function(err, data) {
		response.error = err;
		response.data = data;
		callback && callback(response);
  });
};
