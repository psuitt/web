Statistics.allow({
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

Meteor.publish("statistics_country", function () {
  return Statistics.find( { _type: "country_stat" } );
});

Meteor.publish("statistics_users", function () {
  return Statistics.find( { _type: "usercount" } );
});