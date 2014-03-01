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

Meteor.publish("drinks_items", function (ids) {
	check(ids, Array);
  return Drinks.find( { _id: { $in: ids } } );
});

Meteor.publish("ratings", function () {
  return Ratings.find({});
});

Meteor.publish("ratings_my", function () {
  return Ratings.find({user_id: this.userId});
});

