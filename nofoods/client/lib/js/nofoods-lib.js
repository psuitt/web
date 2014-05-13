NoFoods = {};

NoFoods.lib = function() {

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
					rightArrow = $("<span class='rightarrow'>&#62;</span>");
				
			leftArrow.bind("click", function() {
				alert("Test!");			
			});				
				
			for (var i = 1; i <= max; i += 1 ) {
				var span = $("<span class='paging'>" + i + "</span>")
				div.append(span);
			}
			
			if (callback)
				div.on("click", "span.paging", function() {
					callback(parseInt($(this).html(), 10) - 1);			
				});
			
			div.prepend(leftArrow);
			div.append(rightArrow);
			
			return div;
				
		}
		
	};

}();


