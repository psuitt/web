(function() {
	Template.home.events = {
		'keypress #search': function(evt, template) {
			if (evt.which == 13) {
				$('#searchResults').attr("src", '/search/' + evt.target.value);
				$('#searchResults').load(function() {
						var height = $(this).find("#searchTabsContent").outerHeight();
						this.height = height;					
				});
			}
		}
	};
})();
