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
	
};

var loadNotifications = function() {

	Meteor.call('getUserNotifications', function(err, data) {
	
		if (!err) {
			
			if (data) {
				
				_.each(data, function(notification, index, list) {
					if (notification.message) {
						var li = $('<li></li>');
						li.html(notification.message);
						$('#notificationsList').append(li);
					}
				});
				
				$('#notificationsList').position({
					/* Where the 2nd object will attach. Horizontal Vertical */
					my: 'right top',	
					/* Where the base object will attach. Horizontal (Left, Right, Center) Vertical(Top, Bottom, Center) */
					at: 'right bottom',
					/* Horizontal Vertical */
					offset: '0 10',
					/* What to do if it collides with the window. */
					collision: '',
					of: $('#notifications')[0]
				});
				
			}
			
		}			
	
	});

};