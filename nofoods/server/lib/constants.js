NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

PAGE_LIMIT = 15;

NoFoodz.consts = {};

NoFoodz.consts.urls = {
	FOOD : '/pages/food/',
	DRINK : '/pages/drink/',
	BRAND : '/brand/page/',
	PEOPLE : '/people/page/'
};

NoFoodz.consts.flags = {
	REPORTED : 'R'
};

NoFoodz.consts.filters = {
	HIDDEN_FOODS : {
			fields: {
				keywords: 0,
				reporters: 0	
			}
		}
};

NoFoodz.consts.admin = {
	SUPER : 'S'
};
	
NoFoodz.consts.db = {
	FOOD : 'food',
	DRINK : 'drink'
};	