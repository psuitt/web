var placeauto,
		map,
		nofoodsRating,
		brand_id = false;
		
Template.foodsAdd.destroyed = function () {
	// reset brand id.	
	brand_id = false
};

Template.foodsAdd.rendered = function() {
	
	if (!Meteor.userId()) {
		Router.go('home');
		return;
	}
	
	var data = this.data;

  // reset brand id.	
	brand_id = false
	
	setPath();
	
	nofoodsRating = $('div.ratingDiv').nofoodsrating();

	if (data && data.brand_id) {
		brand_id = data.brand_id;
		var obj = {
			brand_id : data.brand_id		
		};
		Meteor.call('getBrand', obj, function(err, data) {
		
			if (!err) {
				
				var brand = data.brand;
				
				if(brand) {
					$('#foodsadd-brand').attr("disabled", "disabled").val(brand.name);
				} else {
					brand_id = false;
					//$('#foodsadd-brand').nofoodsautocomplete();			
				}				
				
			}
			
		});

	} else {
		//$('#foodsadd-brand').nofoodsautocomplete();
	}

	
	//addLocation(); LOCATION

};

Template.foodsAdd.events({
	'click #save': function (event, template) {
		var type = $('#foodsadd-typeselect .btn.selected').attr("value"),
				name = template.find("#foodsadd-name").value,
				brand = template.find("#foodsadd-brand").value,
				brandId = $("#foodsadd-brand").data("brand_id"),
				rating = nofoodsRating.getValue(); 

		var data = {
			rating: rating,
			name: name,
			brand: brand,
			type: type.toLowerCase()		
		};

		/*
		if (brand_id) {
			data.brand_id = brand_id;
		} else if (brandId) {
			data.brand_id = brandId;
		}*/
	
		//setPlaceDetails(data); LOCATION		
	
		createFood(data, function(response) {

			if (response.error) {
				$(".page-message.message").addClass("alert alert-danger").html(response.error.reason);									
			} else {
				Router.go('foods', {_id:response.id, type: type.toLowerCase()});
			}

		});

	},
	
	'click #foodsadd-typeselect .btn': function (event, template) {
		var selected = $('#foodsadd-typeselect .btn.selected');
		selected.removeClass('selected');
		$(event.currentTarget).addClass('selected');
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



