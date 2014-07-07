Template.home.rendered = function() {
		
	$('#login .logo').hide();
	$('#login .searchbar').hide();		
		
	setPath();
		
	$('#mainContent').addClass('white');
	$('#header').addClass('hidden');
	
};
	
Template.home.destroyed = function() {
	$('#mainContent').removeClass('white');
	$('#header').removeClass('hidden');
	$('#login .logo').show();
	$('#login .searchbar').show();
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

var doSearch = function(search) {
	var val = $('#home-searchtype .home-searchval').html().toLowerCase();
	if (val) {
		//$('#searchResults').attr("src", '/search/' + val + '/' + search);
		DoSearch(val, search);
	}	
};
