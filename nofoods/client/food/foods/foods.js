var nofoodsRating,
		idField,
		updateMethod;

Template.foods.destroyed = function () {
};

var done = function(err, data) {
	
	if (err || !data || !data.item) {
		Router.go('/404');
	}

	var item = data.item;

	$('.food-name').html(item.name);
	$('.brand').html(NoFoods.lib.createBrandLink(item.brand_id, item.brand_view));
	$('.totalRating').html(item.rating_calc);
	$('.totalCount').html(item.ratingcount_calc);
	$('.foods-location').html(item.address_view);
	
	if (item.flags && item.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1) 
		$('.button.report').addClass('reported')
											 .html('Reported')
											 .attr('title', 'This item has been reported.');

	if (data.userRating) {
		nofoodsRating.setUserValue(data.userRating.rating);
	} else {
		nofoodsRating.setValue(item.rating_calc);
	}

	loadUserData();
	
	// Create the additional info div with the items data
	$("#infoDiv").nofoodzadditionalinfo({
		_id: item._id,
		type: PARAMS.type,
		info: item.info,
		update: item.user_id ===  Meteor.user()._id
	});
 
};

var loadUserData = function() {

	var user = Meteor.user();

	if (user.profile) {

		if (user.profile.wishlist) {
			for (var i = 0, l = user.profile.wishlist.length; i < l; i += 1) {
				if (user.profile.wishlist[i][idField] === PARAMS._id) {
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

Template.foods.rendered = function() {
	
	var obj = {
		_id: PARAMS._id,
		type: PARAMS.type
	};	
	
	if (PARAMS.type === NoFoodz.consts.FOOD) {
		updateMethod = updateFood;
		idField = "food_id";
	} else {
		updateMethod = updateDrink;
		idField = "drink_id";
	}
	
	Meteor.call('getItemById', obj, done);
	
	nofoodsRating = $('div.ratingDiv').nofoodsrating({
		hearts:6,
		select: function(rating) {
			
			var options = {
					rating: rating,
					_id: PARAMS._id		
				};			
			
			updateMethod(options, reload);
			
		}
	});
	
	NoFoods.widgetlib.floatMenu($('#foods-nav'));	

	$('span.wishstar').on('click', function() {
		var options = {};
		
		options[idField] = PARAMS._id;		
		
		Meteor.call('addToWishList', options);
		
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
