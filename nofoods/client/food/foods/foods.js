var nofoodsRating;

Template.foods.destroyed = function () {
};

Template.foods.rendered = function() {
	
	var obj = {
		_id: PARAMS._id,
		type: PARAMS.type
	}	
	
	Meteor.call('getFoodDrinkById', obj, done);
	
	nofoodsRating = $('div.ratingDiv').nofoodsrating({
		hearts:6,
		select: function(rating) {
			
			var options = {
					rating: rating,
					_id: PARAMS._id		
				};			
			
			if (PARAMS.type === NoFoodz.consts.FOOD) {
				updateFood(options, reload);
			} else {
				updateDrink(options, reload);
			}
			
		}
	});	

	$('span.wishstar').on('click', function() {
		var options = {};
		if (PARAMS.type === NoFoodz.consts.FOOD) {
			Meteor.call('addToWishList', {food_id: PARAMS._id});
		}	else {
			Meteor.call('addToWishList', {drink_id: PARAMS._id});
		}	
		
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

var done = function(err, data) {
	
	if (err || !data) {
		Router.go('/404');
	}

	var item = data;

	$('.name').html(item.name);
	$('.brand').html(NoFoods.lib.createBrandLink(item.brand_id, item.brand_view));
	$('.totalRating').html(item.rating_calc);
	$('.totalCount').html(item.ratingcount_calc);
	$('.foods-location').html(item.address_view);

  if (Meteor.user()) {
		loadUserData();
		
		var subscription = 'ratings_myfood';
		
		if (PARAMS.type === NoFoodz.consts.DRINK)
			subscription = 'ratings_mydrink';

		var ratingSub = Meteor.subscribe(subscription, item._id, function() {
			var userRating = Ratings.findOne({user_id: Meteor.userId()});
			if (userRating) {
				nofoodsRating.setValue(userRating.rating);
			} else {
				nofoodsRating.setValue(0);
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
				if (PARAMS.type === NoFoodz.consts.FOOD && user.profile.wishlist[i].food_id === PARAMS._id) {
					$(".wishstar").toggleClass("x100", true);
					break;
				} else if (user.profile.wishlist[i].drink_id === PARAMS._id) {
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



