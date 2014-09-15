NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.consts = function() {

	var _urls = {
		FOOD : '/pages/food/',
		DRINK : '/pages/drink/',
		BRAND : '/brand/page/',
		PEOPLE : '/people/page/'
	};

	return {
	
		urls: _urls,
		PAGE_LIMIT: 2,
		FOOD: "food",
		DRINK: "drink"
	
	}
	
}();

NoFoodz.consts.flags = {
	REPORTED : 'R',
	ADMIN_SUPER : 'S'
};