/*
		Rating custom div

 */
(function ( $ ) {
	
	var enableUpdates;
	
	var _create = function(self) {
		
		var header = $('<div class=\'info-header\'>Info</div>');
		
		self.append(header);
		
		if (enableUpdates)
			self.append("You own this!")
	};
	
	$.fn.nofoodzadditionalinfo = function(options) {

		var self = this;	
		
		var _options = {
			type: 'none',
			info: {},
			update: false
		};	
		
		if (options)
			_options = $.extend(_options, options);		
			
		enableUpdates = _options.update;		
		
		self.addClass('nofoodz-additionalinfo');
		
		_create(self);
		
		return self;

	};

}( jQuery ));