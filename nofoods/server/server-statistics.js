Meteor.publish("statistics_country", function () {
  return Statistics.find( { _type: "country_stat" } );
});