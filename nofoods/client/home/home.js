(function() {
	
	Template.home.rendered = function() {
		$('#mainContent').addClass('white');
	};
	
	Template.home.destroyed = function() {
		$('#mainContent').removeClass('white');
	};
	
	Template.home.events = {
		'keypress #home-search': function(evt, template) {
			if (evt.which == 13) {
				doSearch(evt.target.value);
			}
		},
		'click #home-searchgo': function(evt, template) {
			doSearch($('#home-search').val());
		},
		'click #home-searchtype ul li a': function(e) {
			$('#home-searchtype .home-searchval').html(e.target.innerHTML)
		}
	};

	recalcFrame = function(height) {
		if ($('#searchResults')[0].height < height) {
			$('#searchResults')[0].height = height;
		}
	};

	var doSearch = function(search) {
		var val = $('#home-searchtype .home-searchval').html().toLowerCase();
		if (val) {
			$('#searchResults').attr("src", '/search/' + val + '/' + search);
		}	
	}	
	
})();

