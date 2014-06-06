NoFoods = typeof NoFoods === 'undefined' ? {} : NoFoods;

NoFoods.lib = function() {

	var MAX_PAGE_AMOUNT = 3;

	return {
		
		formatDate: function(date) {
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
		},
		
		createBrandLink: function(id, name) {
			return $("<a></a>").attr('href', '/brand/page/' + id).html(name);
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
	
	return {
		
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
			ratingSpan.addClass("x"+i);	
		
			name.append(nameLink);
			brand.append(brandLink);
			div.append(name);
			div.append(brand);
			div.append(ratingSpan);	
			div.append(ratingNumber);
			
			return div;
		
		}
		
	};

}();


