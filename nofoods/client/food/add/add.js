var placeauto,
		map;

Template.foodsAdd.rendered = function() {
	
	setPath();
	
	$('div.ratingDiv span.rating').on('click', function() {
		var index = $(this).index();			
		$('div.ratingDiv span.rating').each(function() {
			$(this).toggleClass('x100', $(this).index() <= index);						
		});		
	});

	$('#foodsadd-brand').nofoodsautocomplete();
	
	//addLocation(); LOCATION

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
	
		//setPlaceDetails(data); LOCATION		
	
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

	}

});

var addLocation = function() {
	
	var input = document.getElementById('foodsadd-location');
	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(-33.8902, 151.1759),
		new google.maps.LatLng(-33.8474, 151.2631)
	);

	var options = {
		bounds: defaultBounds
	};

	placeauto = new google.maps.places.Autocomplete(input, options);	
	
	if (navigator.geolocation) {
 		navigator.geolocation.getCurrentPosition(function(position) {
    	var geolocation = new google.maps.LatLng(
        	position.coords.latitude, position.coords.longitude);
    	placeauto.setBounds(new google.maps.LatLngBounds(geolocation,
        	geolocation));
        	
    	map = new google.maps.Map(document.getElementById('foodsadd-map'), {
				center: geolocation,
				zoom: 13    	
    	});	
  	});
	} else {
		map = new google.maps.Map(document.getElementById('foodsadd-map'));  	
	}

	setUpMap();

};

var setPlaceDetails = function(data) {
	
	var placeDetails = placeauto.getPlace();
	
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

var setUpMap = function() {
	
	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
 		map: map,
  	anchorPoint: new google.maps.Point(0, -29)
	});

	
	google.maps.event.addListener(placeauto, 'place_changed', function() {
  	infowindow.close();
  	marker.setVisible(false);
  	var place = placeauto.getPlace();
  	if (!place.geometry) {
  	  return;
 	 }

 	 // If the place has a geometry, then present it on a map.
	  if (place.geometry.viewport) {
 	     map.fitBounds(place.geometry.viewport);
 	   } else {
	    map.setCenter(place.geometry.location);
 	     map.setZoom(17);  // Why 17? Because it looks good.
 	   }
	  marker.setIcon(/** @type {google.maps.Icon} */({
	    url: place.icon,
    	size: new google.maps.Size(71, 71),
    	origin: new google.maps.Point(0, 0),
    	anchor: new google.maps.Point(17, 34),
    	scaledSize: new google.maps.Size(35, 35)
 	 }));
 	 marker.setPosition(place.geometry.location);
 	 marker.setVisible(true);

  	var address = '';
  	if (place.address_components) {
    	address = [
      	(place.address_components[0] && place.address_components[0].short_name || ''),
      	(place.address_components[1] && place.address_components[1].short_name || ''),
      	(place.address_components[2] && place.address_components[2].short_name || '')
    	].join(' ');
  	}

  	infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
  	infowindow.open(map, marker);
	});


};



