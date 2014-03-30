(function() {
	
	var place;
	
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
	
		place = new google.maps.places.Autocomplete(input, options);	
		
		if (navigator.geolocation) {
   		navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      place.setBounds(new google.maps.LatLngBounds(geolocation,
          geolocation));
    });
  }


	};
	
	Template.foodsAdd.events({
		'click #save': function (event, template) {
			var type = $("input[name='type']:checked").attr("value"),
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
		
			setPlaceDetails(data);		
		
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

	var setPlaceDetails = function(data) {
		
		var placeDetails = place.getPlace();
		
		if (placeDetails) {
		
			if (placeDetails.address_components) {
				
				data.address = placeDetails.formatted_address;
				data.address_id = placeDetails.id;
				data.longitude = placeDetails.geometry.location.lng();
				data.latitude = placeDetails.geometry.location.lat();
				
				for (var i = 0, l = placeDetails.address_components.length; i < l ; i += 1) {
					component = placeDetails.address_components[i];
					if (component.types.indexOf("political") != -1) {
						if (component.types.indexOf("locality") != -1) {
							data.city = component.long_name;
						} else if (component.types.indexOf("administrative_area_level_1") != -1) {
							data.state = component.long_name;
							data.statecode = component.short_name;
						} else if (component.types.indexOf("country") != -1) {
							data.country = component.long_name;
							data.countrycode = component.short_name;
						}
					}
				}			
			}			
					
		}		
	
	};

})();

