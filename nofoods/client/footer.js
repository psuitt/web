Template.footer.rendered = function() {
		
	var statsSub = Meteor.subscribe('statistics_users', function() {
		
		var stat = Statistics.findOne({});
		
		$('#footer .totalusers').html("Total Users " + stat.count);	
		
		statsSub.stop();
		
	});	
	
};