(function() {
	Template.foodsAdd.rendered = function() {
		$('div.ratingDiv span.rating').on('click', function() {
			var index = $(this).index();			
			$('div.ratingDiv span.rating').each(function() {
				$(this).toggleClass('x100', $(this).index() <= index);						
			});		
		});

		$('#foodsadd-brand').nofoodsautocomplete();

	};
	
	Template.foodsAdd.events({
		'click #save': function (event, template) {
			var type = $("input[name='type']:checked").val(),
					name = template.find("#name").value,
					brand = template.find("#foodsadd-brand").value,
					brand_id = $("#foodsadd-brand").data("brand_id"),
					last = $('div.ratingDiv span.rating.x100').last(),
					rating = parseInt((last.index() + 1), 10); 
		
			var response = createFood({
				rating: rating,
				name: name,
				brand: brand,
				brand_id: brand_id,
				type: type			
			});

			if (response.error) {
				$(".message").addClass("alert alert-error").html(response.error.reason);									
			} else {
				if (type === "Food") {
					Router.go('foodsPage', {_id:response.id});
				} else {
					Router.go('drinksPage', {_id:response.id});
				}
			}

		}/*,

		'keyup #foodsadd-brand': function (event, template) {
			getBrands();
		}*/

	});

	var getBrands = function() {
		$('#foodsadd-brand-autocomplete').addClass("hide");
		$('#foodsadd-brand-autocomplete').html("");
		var brandsSub = Meteor.subscribe("brands_search", $("#foodsadd-brand").val(), function() {
			Brands.find({}).forEach(function(brand) {
				var li = $('<li></li>');
				li.html(brand.name);
				li.data("brand_id",brand._id)
				$('#foodsadd-brand-autocomplete').append(li);
			});
			$('#foodsadd-brand-autocomplete').removeClass("hide");
			brandsSub.stop();
		});
	};



})();

