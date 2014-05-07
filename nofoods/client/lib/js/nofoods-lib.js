NoFoods = {};

NoFoods.lib = function() {

	return {
		
		formatDate: function(date) {
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
		},
		
		createBrandLink: function(id, name) {
			return $("<a></a>").attr('href', '/brand/page/' + id).html(name);
		}
		
	};

}();


