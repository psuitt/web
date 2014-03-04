(function() {
	Template.home.events = {
		'keypress #search': function(evt, template) {
			if (evt.which == 13) {
				$('#searchResults').attr("src", '/search/' + evt.target.value);
				//$('#searchResults').load(function() {
					$('#searchResults').contents().find('a').each(function() {
						$(this).click(function(e) {
							var url = e.target.href;
							window.location.replace(url);
							e.preventDefault();						
						});						
					});				
				//});
			}
		}
	};
})();
