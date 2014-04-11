NoFoods = {};

NoFoods.lib = function() {

	return {
		formatDate: function(date) {
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
		}
	};

}();


