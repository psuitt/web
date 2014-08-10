Meteor.startup(function () {

	var settings = Settings.findOne({'_type' : 'accounts'});
	
	if (!settings) {
		var settings = {
			_id: Random.id(),
			_type: 'accounts',
			disableUserCreate: false
		};	
			
		Settings.insert(settings);
	}
		/*
    var myjson = {};
		myjson = JSON.parse(Assets.getText("data/words.json"));
			  
		if (myjson && myjson.data) {
			for (var i = 0, l = myjson.data.length; i < l ; i+= 1) {
				if (!Words.findOne({word: myjson.data[i].word})) {
					Words.insert({word: myjson.data[i].word}); 
				}
			}
		}
		*/
		
		setUpStatistics();
 		
});

var setUpStatistics = function() {

	 var query = {
    	_type: "usercount"
		};
    
    var findOne = Statistics.findOne(query);

		if (!findOne) {
			
			var stat = {
				_id: Random.id(),
				_type: "usercount",
				count: 0
			};	
			
			Statistics.insert(stat);
			
		}

};
