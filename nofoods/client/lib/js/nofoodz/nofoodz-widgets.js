NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

NoFoods.widgetlib = function() {
	
	var _floatMenu = function(div) {
	
		div.jScroll();
		div.on('click', 'li>a', function() {
			
			var currentTop = $(window).scrollTop(),
					newTop = $("#mainContent").offset().top - 45;
			
			if (currentTop > newTop)
				$('html, body').animate({scrollTop: newTop}, 200);	
				
		});
    	
	};
	
	var _staticOffCanvasMenu = function(div) {
	
		var $window = $(window),
    		top = div.offset().top - 52;

   	$window.scroll(function() {
			var windowTop = $window.scrollTop(),
					menuTop = $('#menu').offset().top;
			if (windowTop > top) {
				var newTop = (menuTop - top) + 'px'				
				div.css('top', newTop);
			} else {
				div.css('top', 0);
			}
    });
    
		div.on('click', 'li>a', function() {
			
			var currentTop = $(window).scrollTop(),
					newTop = $("#mainContent").offset().top - 45;
			
			if (currentTop > newTop)
				$('html, body').animate({scrollTop: newTop}, 200);	
				
		});
    	
	};
	
	return {
		
		floatMenu: function(div) {
			_floatMenu(div);
		},
		
		staticOffCanvasMenu: function(div) {
			_staticOffCanvasMenu(div);
		},
		
		createRatingDiv: function(rating) {

			var div = $("<div class='myrating myfoods'></div>"),
					name = $("<span class='name myfoods'></span>"),
					nameLink = $("<a></a>"),
					brand = $("<span class='brand myfoods'></span>"),
					brandLink = $("<a></a>"),
					ratingSpan = $("<span class='rating'></span>"),
					ratingNumber = $("<span class='ratingNum'></span>"),
					toAdd = null;
			
			name.addClass("lower");
		
			var i = (Math.round((rating.rating * 2))*10).toString();
			
			ratingNumber.html(rating.rating);
			ratingSpan.addClass('x' + i);	
		
			name.append(nameLink);
			brand.append(brandLink);
			div.append(name);
			div.append(brand);
			div.append(ratingSpan);	
			div.append(ratingNumber);
			
			return div;
		
		},
		
		createHeart: function(val, count) {

			var div = $("<div class='ratingDiv'></div>")
					span = $('<span></span>');
			
			var i = (Math.round((parseFloat(val) * 2))*10).toString();
			
			span.addClass('rating');
			span.addClass('x' + i);
			span.attr('title', val);
			
			div.append(span);
			
			if(count) {
				var totalSpan =  $("<span class='totalRating'></span>");
				totalSpan.html(count);	
				div.append(totalSpan);		
			}
			
			
			return div;
		
		},
		
		createEmptySelect: function() {

			var searchType = $("<div></div>")
									.addClass("type btn-group nofoodz-combo"),
					searchTypeMainDisplay = $("<a data-toggle='dropdown'></a>")
									.addClass("btn dropdown-toggle btn-default"),
					searchTypeMainDisplayText = $("<span></span>")
									.addClass("text"),
					searchTypeMainDisplayCaret = $("<span></span>")
									.addClass("caret"),
					searchTypeDropdown = $("<ul></ul>")
									.addClass("dropdown-menu");
									
			searchTypeMainDisplay.append(searchTypeMainDisplayText);
			searchTypeMainDisplay.append(searchTypeMainDisplayCaret);
			
			searchType.append(searchTypeMainDisplay);
			searchType.append(searchTypeDropdown);
			
			return searchType;
		
		},
		
	};

}();
