// Gumby is ready to go
Gumby.ready(function() {
	console.log('Gumby is ready to go...', Gumby.debug());

	// placeholder polyfil
	if(Gumby.isOldie || Gumby.$dom.find('html').hasClass('ie9')) {
		$('input, textarea').placeholder();
	}
});

// Oldie document loaded
Gumby.oldie(function() {
	console.log("This is an oldie browser...");
});

// Touch devices loaded
Gumby.touch(function() {
	console.log("This is a touch enabled device...");
});

// Document ready
$(document).ready(function() {
	$("#sidebar-nav li a").on("click", function() {
		$("#sidebar-nav li").removeClass("selected");
		$(this).parent().addClass("selected");
        // Prevent the anchor link.
        return false;
   });
});

var selectMenuItemColor = function() {
	$("#sidebar-nav ul li a").removeClass("selected");
};

