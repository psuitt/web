(function() {
	
	Template.foodsAdd.rendered = function() {
		$('div.ratingDiv span.rating').on('click', function() {
			var index = $(this).index();			
			$('div.ratingDiv span.rating').each(function() {
				$(this).toggleClass('x100', $(this).index() <= index);						
			});		
		});

		$('#foodsadd-brand').nofoodsautocomplete();
		
		var input = document.getElementById('foodsadd-location');
		var defaultBounds = new google.maps.LatLngBounds(
  		new google.maps.LatLng(-33.8902, 151.1759),
  		new google.maps.LatLng(-33.8474, 151.2631)
  	);

		var options = {
  		bounds: defaultBounds
		};
	
		var autocomplete = new google.maps.places.Autocomplete(input, options);	
		
		if (navigator.geolocation) {
   		navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
          geolocation));
    });
  }


	};
	
	Template.foodsAdd.events({
		'click #save': function (event, template) {
			var type = $("input[name='type']:checked").val(),
					name = template.find("#foodsadd-name").value,
					brand = template.find("#foodsadd-brand").value,
					brand_id = $("#foodsadd-brand").data("brand_id"),
					last = $('div.ratingDiv span.rating.x100').last(),
					rating = parseInt((last.index() + 1), 10); 

			var data = {
				rating: rating,
				name: name,
				brand: brand,
				type: type			
			};

			if (brand_id) 
				data.brand_id = brand_id;
		
			createFood(data, function(response) {

				if (response.error) {
					$(".message").addClass("alert alert-error").html(response.error.reason);									
				} else {
					if (type === "Food") {
						Router.go('foodsPage', {_id:response.id});
					} else {
						Router.go('drinksPage', {_id:response.id});
					}
				}

			});

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

