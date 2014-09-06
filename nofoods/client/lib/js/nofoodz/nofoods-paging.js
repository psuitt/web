/*
		Rating custom div

 */
(function ( $ ) {
	
	var MAX_PAGE_AMOUNT = 3;
	
	$.fn.nofoodspaging = function(options) {

		var self = this;

		var _options = {
			max: 0,
			select: false
		};	
		
		if (options)
			_options = $.extend(_options, options);	
			
		_options.max = Math.round(_options.max);

		var firstArrow = $("<span class='first arrow' title='First Page'>&#60;&#60;</span>"),
				leftArrow = $("<span class='left arrow disabled' title='Page Left'>&#60;</span>"),
				rightArrow = $("<span class='right arrow' title='Page Right'>&#62;</span>"),
				lastArrow = $("<span class='last arrow' title='Last Page'>&#62;&#62;</span>"),
				lastPage = MAX_PAGE_AMOUNT,
				maxVal = _options.max;
				
		self.addClass('pagingdiv');
		
		// Functions
		
		var _setMax = function(newMax) {
			
			_options.max = newMax;
			
			lastPage = MAX_PAGE_AMOUNT;
			maxVal= _options.max;
			
			if (maxVal < lastPage) 
				lastPage = maxVal;
			
			for (var i = 1; i <= lastPage; i += 1 ) {
				var span = $("<span class='paging'>" + i + "</span>");
				
				if (i === 1) 
					span.addClass('current');		
				
				self.append(span);
			}
			
			if (maxVal <= MAX_PAGE_AMOUNT)
				rightArrow.addClass('disabled');
		
		};
		
		var _recenterNumbers = function(c) {
		
			if (c > 1 && c < maxVal) {
			
				var pages = self.find('.paging');
				
				// If the center page is not current have to check the sides.
				if (pages.length > 2 && !pages.eq(1).hasClass('current')) {
					
					if (pages.eq(0).hasClass('current')) {
						
						var index = parseInt(pages.eq(0).html(), 10);
						
						if (index > 1)
							leftArrow.click();
						
					} else {
						// The end is current.
						var index = parseInt(pages.eq(2).html(), 10);
						
						if (index < maxVal)
							rightArrow.click();
						
					}
					
				}
			
			}
		
		};
		
		var _remove = function() {
			firstArrow.off().remove();
			leftArrow.off().remove();
			rightArrow.off().remove();
			lastArrow.off().remove();
			self.off().remove();
		};
		
		// Functions
		
		var obj = {
			setMax: function(i) {
				_setMax(i);			
			},
			remove: function() {
				_remove();			
			}
		};
		
		if (_options.max < 2) {
			// Return now there is no paging needed.
			self.addClass('no-border');			
			return obj;
		}	
		
		// Setup
		
		_setMax(_options.max);
		
		leftArrow.on("click", function() {
			var first = self.find('.paging').first(),
					firstVal = parseInt(first.html(), 10);
	
			if (firstVal > 1) {
				self.find('.paging').last().remove();
				$(this).after($("<span class='paging'>" + (firstVal - 1) + "</span>"));
				var last = self.find(".paging").last(),
						lastVal = parseInt(last.html(), 10);
				if (maxVal > lastVal)
					rightArrow.removeClass('disabled');		
			}
			
			if (firstVal === 2) {
				$(this).addClass('disabled');	
			}	
					
		});	
		
		rightArrow.on("click", function() {
			
			var last = self.find(".paging").last(),
					lastVal = parseInt(last.html(), 10),
					maxVal = parseInt(_options.max, 10);	
								
			if (maxVal > lastVal) {
				self.find(".paging").first().remove();
				$(this).before($("<span class='paging'>" + (lastVal + 1) + "</span>"));
				var first = self.find('.paging').first(),
						firstVal = parseInt(first.html(), 10);
				if (firstVal > 1)
					leftArrow.removeClass('disabled');
			}
			
			if (maxVal === (lastVal + 1)) {
				$(this).addClass('disabled');
			}	
			
		});				
		
		self.prepend(leftArrow);
		self.append(rightArrow);
		
		if (_options.select) {
			
			self.on('click', 'span.paging', function() {
				self.find('span.current').removeClass('current'); 
				$(this).addClass('current');
				_recenterNumbers(parseInt($(this).html(), 10));
				_options.select(parseInt($(this).html(), 10));			
			});
			
			firstArrow.on("click", function() {
				
				self.find(".paging").remove();	
						
				for (var i = 1; i <= lastPage; i += 1 ) {
					var span = $("<span class='paging'>" + i + "</span>");
					
					if (i === 1) 
						span.addClass('current');		
					
					rightArrow.before(span);
				}
				
				var last = self.find(".paging").last(),
						lastVal = parseInt(last.html(), 10),
						maxVal = parseInt(_options.max, 10);
				if (maxVal > lastVal)
					rightArrow.removeClass('disabled');
				
				_options.select(1);	
							
			});	
			
			lastArrow.on("click", function() {
				
				var maxVal = parseInt(_options.max, 10),
						v = maxVal - MAX_PAGE_AMOUNT;
				
				if (v < 0)
					v = 0;	
				
				self.find(".paging").remove();	
						
				for (var i = maxVal; i > v; i -= 1 ) {
					var span = $("<span class='paging'>" + i + "</span>");
					
					if (i === maxVal) 
						span.addClass('current');		
					
					leftArrow.after(span);
				}
				
				var first = self.find('.paging').first(),
						firstVal = parseInt(first.html(), 10);
				if (firstVal > 1)
					leftArrow.removeClass('disabled');
				
				_options.select(maxVal);
				
			});
			
			self.prepend(firstArrow);
			self.append(lastArrow);	
			
		}		
		
		return obj;

	};

}( jQuery ));