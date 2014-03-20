(function() {
	Template.home.events = {
		'keypress #search': function(evt, template) {
			if (evt.which == 13) {
				$('#searchResults').attr("src", '/search/food/' + evt.target.value);
			}
		}
	};

	recalcFrame = function(height) {
		if ($('#searchResults')[0].height < height) {
			$('#searchResults')[0].height = height;
		}
	};
})();

