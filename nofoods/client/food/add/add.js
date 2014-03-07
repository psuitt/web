(function() {
	Template.foodsAdd.rendered = function() {
		$('div.ratingDiv span.rating').on('click', function() {
			var index = $(this).index();			
			$('div.ratingDiv span.rating').each(function() {
				$(this).toggleClass('x100', $(this).index() <= index);						
			});		
		});	

	};
	
	Template.foodsAdd.events({
		'click #save': function (event, template) {
			var type = $("input[name='type']:checked").val(); 
			var name = template.find("#name").value;
			var brand = template.find("#brand").value;
			var last = $('div.ratingDiv span.rating.x100').last();
			var rating = parseInt((last.index() + 1), 10); 
		
			var id = createFood({
				rating: rating,
				name: name,
				brand: brand,
				type: type			
			});
 
			if (type === "food") {
				Router.go('foodsPage', {_id:id});
			} else {
				Router.go('drinksPage', {_id:id});
			}

		}

	});



})();

