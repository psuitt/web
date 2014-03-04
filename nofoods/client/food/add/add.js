(function() {
	Template.foodsAdd.events({
		'click .rating': function (event, template) {
			if (template.find(".rating.selected")) {
				template.find(".rating.selected").className = "rating";
			}
			event.target.className = "rating selected";
		},

		'click #save': function (event, template) {
			var type = $("input[name='type']:checked").val(); 
			var name = template.find("#name").value;
			var brand = template.find("#brand").value;
			var rating = parseInt(template.find(".selected").innerHTML, 10); 
		
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

