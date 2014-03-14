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
			var brand = template.find("#foodsadd-brand").value;
			var last = $('div.ratingDiv span.rating.x100').last();
			var rating = parseInt((last.index() + 1), 10); 
		
			var id = createFood({
				rating: rating,
				name: name,
				brand: brand,
				type: type			
			}, function(error) {
				if (error) {
					alert(error);					
				}			
			});
 
			if (type === "Food") {
				Router.go('foodsPage', {_id:id});
			} else {
				Router.go('drinksPage', {_id:id});
			}

		},

		'keyup #foodsadd-brand': function (event, template) {
			getBrands();
		}

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

