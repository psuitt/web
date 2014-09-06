NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.format = function() {

	return {
	
		camelCase: function(s) {
			return (s||'').toLowerCase().replace(/(\b|-)\w/g, function(m) {
    		return m.toUpperCase();
  		});
		}
	
	}
	
}();
