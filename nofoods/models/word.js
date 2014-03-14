Words = new Meteor.Collection("words");

// Subset lists
//FoodsItem = new Meteor.Collection("foodsitem");

Words.allow({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    // not possibly yet
    return false;
  }
});

Meteor.methods({



});
