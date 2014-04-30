setPath = function () {
	var path = window.location.pathname,
			last = false;
	
	$('#links>a').removeClass('current');
	
	$('#links>a').each(function() {
		
		if (path.indexOf($(this).attr('href')) != -1) {
			last = $(this);		
		}	
		
	});
	
	if (last) {
		last.delay(2000).addClass('current');	
	}
}

Template.mainLayout.rendered = function() {
	
	$('.searchbar input').nofoodssearch();
	
};