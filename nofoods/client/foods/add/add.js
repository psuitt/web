(function() {
	Template.foodsAdd.events({
		'click .rating': function (event, template) {
			if (template.find(".rating.selected")) {
				template.find(".rating.selected").className = "rating";
			}
    	event.target.className = "rating selected";
			t = template.find(".rating.selected").className;
			r = template.find(".rating").className;
		},

		'click #save': function (event, template) {
    	var name = template.find("#name").value;
			var rating = template.find(".selected").innerHTML;
		}

	});

})();
