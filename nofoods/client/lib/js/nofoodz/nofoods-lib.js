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
