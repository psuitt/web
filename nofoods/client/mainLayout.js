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
	
};