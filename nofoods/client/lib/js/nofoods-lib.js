NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

NoFoods.lib = function() {

	var MAX_PAGE_AMOUNT = 3;

	return {
		
		formatDate: function(date) {
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
		},
		
		formatDateTime: function(date) {

			var time = [],
					hours = date.getHours() + 1;
			
			time.push((date.getMonth() + 1));
			time.push('/');
			time.push(date.getDate());
			time.push('/');
			time.push(date.getFullYear());
			time.push(' ');
			time.push((hours % 12));
			time.push(':');
			time.push((date.getMinutes() + 1));
						
			if (hours > 11 && hours !== 24) {
				time.push(' PM');
			} else {
				time.push(' AM');			
			}
			
			return time.join('');
		},
		
		createBrandLink: function(id, name) {
			return $('<a></a>').attr('href', '/brand/page/' + id).html(name);
		}
		
	};

}();

NoFoods.lib.key = function() {

	return {
		getCode: function(e) {
			return e.keyCode || e.which;
		}
	};

}();

NoFoods.widgetlib = function() {
	
	var _floatMenu = function(div) {
	
		div.jScroll( { top: 50 } );
    	
	};
	
	return {
		
		floatMenu: function(div) {
			_floatMenu(div);
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
		
		}
		
	};

}();


