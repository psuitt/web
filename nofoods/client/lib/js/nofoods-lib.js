NoFoods = {};

NoFoods.lib = function() {

	var MAX_PAGE_AMOUNT = 3;

	return {
		
		formatDate: function(date) {
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
		},
		
		createBrandLink: function(id, name) {
			return $("<a></a>").attr('href', '/brand/page/' + id).html(name);
		},
		
		createPagingDiv: function(max, callback) {
			
			if (!max || max < 1)
				return "";	
			
			var div = $("<div class='myfoods-paging pagingdiv'></div>"),
					leftArrow = $("<span class='leftarrow'>&#60;</span>"),
					rightArrow = $("<span class='rightarrow'>&#62;</span>")
					lastPage = MAX_PAGE_AMOUNT;
					
			if (max < lastPage) 
				lastPage = max;
			
			for (var i = 1; i <= lastPage; i += 1 ) {
				var span = $("<span class='paging'>" + i + "</span>");
				
				if (i === 1) 
					span.addClass('current');		
				
				div.append(span);
			}
			
			div.attr("max", max);
			
			if (callback)
				div.on('click', 'span.paging', function() {
					div.find('span.current').removeClass('current'); 
					$(this).addClass('current');
					callback(parseInt($(this).html(), 10));			
				});
			
			leftArrow.bind("click", function() {
				var first = div.find(".paging").first(),
						firstVal = parseInt(first.html(), 10);			
				if (firstVal > 1) {
					div.find(".paging").last().remove();
					$(this).after($("<span class='paging'>" + (firstVal - 1) + "</span>"))
				}				
			});	
			
			rightArrow.bind("click", function() {
				var last = div.find(".paging").last(),
						lastVal = parseInt(last.html(), 10);			
				if (max > lastVal) {
					div.find(".paging").first().remove();
					$(this).before($("<span class='paging'>" + (lastVal + 1) + "</span>"))
				}		
			});				
			
			div.prepend(leftArrow);
			div.append(rightArrow);
			
			return div;
				
		}
		
	};

}();


