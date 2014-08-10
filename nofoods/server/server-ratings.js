Ratings.allow({
  insert: function (userId, food) {
    return false; 
  },
  update: function (userId, food, fields, modifier) {
    return false;
  },
  remove: function (userId, food) {
    return false;
  }
});