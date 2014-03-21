Locations = new Meteor.Collection("locations");

Locations.allow({
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

Meteor.methods({



});