Template.brandsTemplate.rendered = function() {
	Meteor.subscribe('brands_item', PARAMS._id, function() {
		done();
	}); 
	
};

var done = function() {
	// This can sometime contain more data if froming from another page.
	var brand = Brands.findOne({_id : PARAMS._id});

	if(!brand)
		Router.go('/404');

	$('.brand').html(brand.name);
	$('.totalRating').html(brand.rating_calc);

	$("#foodsList").html("");	
	$("#drinksList").html(""); 

	Meteor.subscribe('foods_brand', brand._id, function() {
		Foods.find({}).forEach(function(food) {
			var li = $("<li></li>");
			li.html(food.name);
			$("#foodsList").append(li);
		});
	}); 	

	Meteor.subscribe('drinks_brand', brand._id, function() {
		Drinks.find({}).forEach(function(drink) {
			var li = $("<li></li>");
			li.html(drink.name);
			$("#drinksList").append(li);
		});
	}); 	
	

};

