Template.reported.rendered = function() {
	getReportedPage(1, false);
	
	$('#reported-content').on('click', 'a.remove', function(e) {
		
		var options = {
			items: []
		};
		
		var item = {};
		
		if ($(this).data('food_id')) {
			item._id = $(this).data('food_id');
			item.type = NoFoodz.consts.FOOD;
		} else {
			item._id = $(this).data('drink_id');
			item.type = NoFoodz.consts.DRINK;
		}
		
		options.items.push(item);
		
		Meteor.call( 'removeItems', options, success );	
		$(this).parent().remove();
		e.preventDefault();
	});
};

var success = function(err) {

	if (!err) {
		$('div.alertmessage').html('Remove was successful!');
		$('div.alertmessage').show().delay(3500).fadeOut(1000);
	}

};

var getReportedPage = function(page, count) {

	var obj = { 
		page: page 
	};	
	
	if (count) 
		obj.count = true;
	
	Meteor.call('findReportedItems', obj, function(err, data) {
		
		var contentDiv = $("#reported-content");
		
		contentDiv.html('');
		
		if (!err && data) {
			
			createItemsRow(data.foods, NoFoodz.consts.FOOD);
			createItemsRow(data.drinks, NoFoodz.consts.DRINK);	
			
			if (count) {
				$(".myfoods-paging").nofoodspaging({
					max: data.count / data.maxPageSize,
					select: getReportedPage
				});			
			}			
			
		} else {
			contentDiv.html(err.message);		
		}
		
  });
};

var createItemsRow  = function(list, type) {
	
	if (!list)
		return;
		
	var contentDiv = $("#reported-content");
		
	for (var i = 0, len = list.length; i < len; i += 1) {
		
		var item = list[i];
		var div = $("<div class='myrating myfoods'></div>");
		var title = $("<span class='name myfoods'></span>");
		var brand = $("<span class='brand myfoods'></span>");
		var removeLink = $("<a class='remove myfoods' href='#'>Remove</a>");
		var link = '';

		title.addClass('lower');

		if (type === NoFoodz.consts.FOOD) {
			link = $('<a></a>').attr('href', NoFoodz.consts.urls.FOOD + item.brand_id)
												 .html(item.name);
			removeLink.data('food_id', item._id);									 							
		} else {
			link = $('<a></a>').attr('href', NoFoodz.consts.urls.DRINK + item.brand_id)
												 .html(item.name);
			removeLink.data('drink_id', item._id);
		}	
		
		title.append(link);
		
		var brandLink = $('<a></a>').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id)
																.html(item.brand_view);
																
		brand.append(brandLink);

		div.append(title);
		div.append(brand);
		div.append(removeLink);

		// Reverse the order they were added.
		contentDiv.append(div);	
		
	}	
	
};
