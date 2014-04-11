Template.mainLayout.rendered = function() {

	var path = window.location.pathname,
			last = false;
	
	$('#menu>a').each(function() {
		if (path.indexOf($(this).attr('href')) != -1) {
			last = $(this);		
		}	
	});
	
	if (last) {
		last.addClass('current');	
	}
	
};