/*
		Autocomplete custom for no foods built on top of jquery.

 */
(function ( $ ) {
	$.fn.nofoodsautocomplete = function() {

		var self = this,
				_list = $("<ul></ul>")
								.addClass("nofoods-autocomplete")
								.insertAfter(this);

		_list.width(self.outerWidth());

		self.keydown(function ( event ) {
			var code = event.keyCode || event.which;
			switch(code) {
				case 9:
					var li = _list.find("li.selected");
					self.val(li.html());
					self.data("brand_id", li.data('brand_id'));
					break;
				case 13:
					var li = _list.find("li.selected");
					self.val(li.html());
					self.data("brand_id", li.data('brand_id'));
					break;
				case 38:
					event.preventDefault();
					break;
				case 40:
					event.preventDefault();
					break;
				default:
					break;
			}
		})
		.keyup(function( event ) {

			var code = event.keyCode || event.which;			

			switch(code) {
				case 38:

					var li = _list.find("li.selected").removeClass('selected');

          if(li.prev() && li.prev().length){
						li.prev().addClass('selected');
					} else{
						_list.find('li').last().addClass('selected');
					}

					event.preventDefault();

					break;
				case 40:

					var li = _list.find("li.selected").removeClass('selected');
          
					if(li.next() && li.next().length){
						li.next().addClass('selected');
					} else{
						var test = _list.find('li').first();
						_list.find('li').first().addClass('selected');
					}

					event.preventDefault();

					break;
				default:
					_list.html("");
					var sub = Meteor.subscribe("brands_search", self.val(), function() {
						Brands.find({}).forEach(function(brand) {
							var li = $('<li></li>');
							li.html(brand.name);
							li.data("brand_id", brand._id)
							_list.append(li);
						});
						_show();
						sub.stop();
					});
					break;
			}

		});	

		self.focusout(function( event ) {
			_hide();
		});	

		var _options = {
			position: {
				/* Where the 2nd object will attach. Horizontal Vertical */
				my: "left top",	
				/* Where the base object will attach. Horizontal (Left, Right, Center) Vertical(Top, Bottom, Center) */
				at: "left bottom",
				/* Horizontal Vertical */
				offset: "0 0",
				/* What to do if it collides with the window. */
				collision: "fit flip"		
			}
		};

		var _show = function() {
			var positionCss = $.extend({}, _options.position, {of: self.get(0)});
			_list.position(positionCss);
			if (self.is(":focus")) {
				_list.is(":visible") || _list.toggle(true);
			} else {
				_hide(list);			
			}
		};

		var _hide = function() {
			_list.is(":visible") && _list.toggle(false);
		};

		return this;

	};

}( jQuery ));



