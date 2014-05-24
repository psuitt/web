var foodSub,
		nofoodsRating;

Template.foodsTemplate.destroyed = function () {
	foodSub && foodSub.stop();
};

Template.foodsTemplate.rendered = function() {
	
	foodSub = Meteor.subscribe('foods_item', PARAMS._id, function() {done();});
	
	nofoodsRating = $('div.ratingDiv').nofoodsrating({
		hearts:6,
		select: function(rating) {
			var id = updateFood({
				rating: rating,
				_id: PARAMS._id		
			}, reload);
		}
	});	

	$('span.wishstar').on('click', function() {
		Meteor.call('addToWishList', {food_id: PARAMS._id});
		$(".wishstar").toggleClass("x100", true);	
	});
	
	document.getElementById('gallerylinks').onclick = function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {
   				fullScreen: false,
        	index: link, 
        	event: event},
        links = this.getElementsByTagName('a');
    blueimp.Gallery(links, options);
	}; 
	
	$('div.content.images').removeClass('hidden');
	
	$("div.imagesbutton").click(function() {
		var o = $(this);
		if (o.hasClass("show"))	{
			o.removeClass("show");
			o.find("span").html("Hide Images");	
			$('#gallerylinks').show(400);	
		} else {
			o.addClass("show");
			o.find("span").html("Show More Images");
			$('#gallerylinks').hide(400);
		}
	});
	
};

Template.foodsTemplate.events({
		
});

var done = function() {
	// This can sometime contain more data if froming from another page.
	var food = Foods.findOne({_id : PARAMS._id});

	if(!food)
		Router.go('/404');

	$('.name').html(food.name);
	$('.brand').html(NoFoods.lib.createBrandLink(food.brand_id, food.brand_view));
	$('.totalRating').html(food.rating_calc);
	$('.totalCount').html(food.ratingcount_calc);
	$('.foods-location').html(food.address_view);

  if (Meteor.user()) {
		loadUserData();

		var ratingSub = Meteor.subscribe('ratings_myfood', food._id, function() {
			var userRating = Ratings.findOne({user_id: Meteor.userId()});
			if (userRating) {
				setRatingSelected(userRating.rating);
			}
			ratingSub.stop();
		});

  }  
};

var loadUserData = function() {

	var user = Meteor.user();

	if (user.profile) {

		if (user.profile.wishlist) {
			for (var i = 0, l = user.profile.wishlist.length; i < l; i += 1) {
				if (user.profile.wishlist[i].food_id === PARAMS._id) {
					$(".wishstar").toggleClass("x100", true);
					break;
				}
			}
		}

	}

};

var reload = function(response) {

	$('.totalRating').html(response.data.rating_calc);
	$('.totalCount').html(response.data.ratingcount_calc);

};

var setRatingSelected = function(n) {
	$('div.ratingDiv span.rating').each(function() {
		$(this).toggleClass('x100', $(this).index() <= (n-1));						
	});	
};



