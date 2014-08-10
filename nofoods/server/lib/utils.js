NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.utils = {

	StripCharacters: function(s) {
		return s.replace(/[^\w\s]/gi, '');
	},

	Tokenize: function(s) {
		var l = s.toLowerCase();
		
		l = l.replace(/[^\w\s]/gi, '');	
		
		var sp = l.split(" ");
		var uniqueArray = [];
		for (var i = 0, l = sp.length; i < l ; i += 1) {
			if (uniqueArray.indexOf(sp[i]) === -1)
				uniqueArray.push(sp[i]);	
		};
		return uniqueArray;
	}

}