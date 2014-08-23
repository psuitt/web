setPath = function () {
	var path = window.location.pathname,
			last = false;
	
	$('#links ul.menu li').removeClass('selected');
	
	$('#links ul.menu li>a').each(function() {
		
		if (path.indexOf($(this).attr('href')) != -1) {
			last = $(this).parent();		
		}	
		
	});
	
	if (last) {
		last.delay(2000).addClass('selected');	
	}
}

Template.mainLayout.rendered = function() {
	
	$('.searchbar input').nofoodssearch();
	
	$(document).on('click', '#notifications', function() {
		
		if (!$(this).hasClass('open')) {
			$(this).addClass('open');
			$('#notificationsList').html('');
			$('#notificationsList').addClass('open');
			loadNotifications();
		}	else {
			$(this).removeClass('open')
			$('#notificationsList').removeClass('open');
		}
	
	});
	
	addReportDialog();
	
};

var loadNotifications = function() {

	var li = $('<li class=\'title\'></li>');
	li.html("Notifications");
	$('#notificationsList').append(li);	

	Meteor.call('getUserNotifications', function(err, data) {
	
		if (!err) {
			
			if (data && data.length > 0) {	
				
				_.each(data, function(notification, index, list) {
					if (notification.message) {
						var li = $('<li></li>'),
								span = $('<span></span>');
								
						li.html(notification.message);
						span.html(NoFoods.lib.formatDateTime(notification.date));						
						
						li.prepend(span);
						$('#notificationsList').append(li);
					}
				});
				
			} else {
				var li = $('<li></li>');
				li.html("No notifications available");
				$('#notificationsList').append(li);							
			}
			
		}	else {
			var li 	= $('<li></li>');
			li.html(err);
			$('#notificationsList').append(li);							
		}		
	
	});

};

var addReportDialog = function() {

	$(document).on('click', '.button.report', function() {
		
		
	
	});

};