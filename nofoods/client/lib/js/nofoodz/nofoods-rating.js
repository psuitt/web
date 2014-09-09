/*
		Rating custom div

 */
(function ( $ ) {
	$.fn.nofoodsrating = function(options) {

		var self = this;				
		
		var _options = {
			hearts: 5,
			select: false
		};	
		
		if (options)
			_options = $.extend(_options, options);				
			
		self.addClass('ratingDiv');
		
		for (var i = 0; i < _options.hearts ; i += 1) {
			var heart = $('<span></span>');
			heart.addClass('rating');
			if (i > 4)	
				heart.addClass('dashed');
			self.append(heart);
		}	

		self.find('span.rating').bind('click', function() {
			var index = $(this).index();			
			self.find('span.rating').each(function() {
				$(this).toggleClass('x100 blue', $(this).index() <= index);						
			});
			self.find('span.rating').removeClass('x10 x20 x30 x40 x50 x60 x70 x80 x90');
			_options.select && _options.select(_getValue());		
		});
		
		self.find('span.rating').bind('mouseenter', function() {
			var index = $(this).index();			
			self.find('span.rating').each(function() {
				var i = $(this).index();
				if (i <= index) {
					$(this).fadeTo(50, 1).toggleClass('tempx100', true);
				}	else {
					$(this).fadeTo(50, .5).toggleClass('tempx100', false);						
				}			
			});
		});
		
		self.bind('mouseleave', function() {
			self.find('span.rating').each(function() {
				$(this).fadeTo(50, 1).toggleClass('tempx100', false);				
			});
		});

		// Functions
		
		var _setValue = function(i) {
			var f = parseFloat(i),
					floor = Math.floor(i),
					lastClass = 'x' + (Math.round((f - floor)*10)*10).toString();

			if (f === floor)	
				lastClass = 'x100';				
					
			self.find('span.rating').each(function(index) {
				$(this).toggleClass('blue', false).toggleClass('x100', index < (f-1));
				if (index >= (f - 1)) {
					$(this).toggleClass('blue', false).toggleClass(lastClass, true);
					// Done Processing					
					return false;
				}
			});	
		};
		
		var _setUserValue = function(i) {
			self.find('span.rating').each(function() {
				$(this).toggleClass('x100 blue', $(this).index() < i);						
			});	
		};

		var _getValue = function() {
			var last = self.find('span.rating.x100').last();
			return parseInt((last.index() + 1), 10); 
		};

		return {
			setValue: function(i) {
				_setValue(i);			
			},
			setUserValue: function(i) {
				_setUserValue(i);			
			},
			getValue: function() {
				return _getValue();			
			}	
		};

	};

}( jQuery ));