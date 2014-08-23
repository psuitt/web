/*
		Search custom for no foods built on top of jquery.

 */
(function ( $ ) {
	$.fn.nofoodssearch = function() {

		var options = {
			values: ['Food', 'Brand', 'People'],
			defaultValue: "Food"
		};	

		var self = this,
				_searchType = $("<div></div>")
								.addClass("nofoodssearch type btn-group")
								.insertBefore(this),
				_goButton = $("<button></button>")
								.addClass("nofoodssearch go btn btn-default glyphicon glyphicon-search")
								.insertAfter(this);
								
		var _searchTypeMainDisplay = $("<a data-toggle='dropdown'></a>")
								.addClass("btn dropdown-toggle btn-default"),
				_searchTypeMainDisplayText = $("<span></span>")
								.addClass("nofoodssearch text"),
				_searchTypeMainDisplayCaret = $("<span></span>")
								.addClass("nofoodssearch caret"),
				_searchTypeDropdown = $("<ul></ul>")
								.addClass("dropdown-menu");
								
		_searchTypeMainDisplay.append(_searchTypeMainDisplayText);
		_searchTypeMainDisplay.append(_searchTypeMainDisplayCaret);
		
		_searchType.append(_searchTypeMainDisplay);
		_searchType.append(_searchTypeDropdown);
		
		_searchTypeMainDisplayText.html(options.defaultValue);
		
		// Add the options now.
		for (var i = 0, length = options.values.length ; i < length ; i += 1) {
			var li = $('<li></li>'),
					a = $('<a></a>');
					
			a.html(options.values[i]);	
			li.append(a);
			_searchTypeDropdown.append(li);
			
		}
		
		self.attr('placeholder', 'Search');
		self.addClass('form-control inline')	
		
		self.keyup(function( event ) {

			var code = event.keyCode || event.which;			

			switch(code) {
				case 13:
					go();
					break;
				default:
					break;
			}
		
		});	
		
		_goButton.bind('click', function() {go();});	
		
		_searchTypeDropdown.on('click', 'a', function(e) {
			_searchTypeMainDisplayText.html(e.target.innerHTML)
		});
		
		var go = function() {
			var val = self.val().trim(),
					type = _searchTypeMainDisplayText.html().toLowerCase();
			if (val.length > 0) {
				Router.go('results', {
					type: type,
					search: val
				});
			}
		};
		
		return this;

	};

}( jQuery ));



