Brands.allow({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});

Meteor.publish("brands_item", function (id) {
	check(id, String);
  return Brands.find({_id: id});
});

Meteor.publish("brands_search", function (search) {
	check(search, NonEmptyStringNoSpecialCharacters);
	
	var query = {
		name : {
	    $regex: ".*" + search + ".*",
	    $options: 'i'
		}
	};
	var filter = {
		sort: {name: 1},
		limit: 10
	};
  return Brands.find(query, filter);
});
