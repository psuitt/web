var button;

Template.report.rendered = function() {
	
	addReportDialog();
	
};


var addReportDialog = function() {

	var reportDialog = $('#report-dialog').modal({
		show: false,
  	keyboard: false
	});

	$(document).on('click', '.button.report', function() {

	  $('#report-dialog').modal('show');
	  button = $(this);
	
	});
	
	$('#report-button').click(function() {
		
		if (!button) {
			return;
		}
		
		var options = {};
		
		options._id = button.attr('item-id');
		options.type = button.attr('item-type').toLowerCase();
		
		Meteor.call('reportInappropriate', options, function(err, data) {
		
			if (!err) {
				
				 $('#report-dialog').modal('hide');
				 button.html('Reported').addClass('reported');
				
			}
			
		});
	});

};