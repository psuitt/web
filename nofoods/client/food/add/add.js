(function() {
	Template.foodsAdd.rendered = function() {
		$('#ratingDiv span.rating').on('click', function() {
			var index = $(this).index();			
			$('#ratingDiv span.rating').each(function() {
				$(this).toggleClass('full', $(this).index() <= index);						
			});		
		});	

	};
	
	Template.foodsAdd.events({
		'click #save': function (event, template) {
			var type = $("input[name='type']:checked").val(); 
			var name = template.find("#name").value;
			var brand = template.find("#brand").value;
			var last = $('#ratingDiv span.rating.full').last();
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

