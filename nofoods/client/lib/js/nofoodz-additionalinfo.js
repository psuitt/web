/*
		Rating custom div

 */
(function ( $ ) {
	
	var Mode = {
		DISPLAY : 'd',
		EDIT : 'e'
	};
	
	var _mode = Mode.DISPLAY,
			_enableUpdates;
	
	var _options = {
			type: 'none',
			info: {},
			update: false
		};
	
	/* Sections */		
	var _saveSection;
	
	/* Buttons */	
	
	var _editButton,
			_saveButton,
			_cancelButton;
	
	var _create = function(self) {
		
		var header = $('<div class=\'info-header\'>Info</div>');
		
		self.append(header);
		
		if (_enableUpdates) {
			_editButton = $('<button type=\'button\' class=\'btn btn-default edit\' >'
					+ '<span class=\'glyphicon glyphicon-edit\'></span>Click to edit info</button>');
			_editButton.on('click', function() {_toggleMode(Mode.EDIT);});
			self.append(_editButton);
		}
		
		_saveSection = $('<div class=\'save-section\'></div>');
		
		self.append(_saveSection);
			
	};
	
	var _toggleMode = function (mode) {
		
		if (_mode === mode) 
			return;		
			
		_mode = mode;
		
		switch(mode) {
			case Mode.DISPLAY:
				_destroyEdit();
				_toggleDisplay();
				break;
			case Mode.EDIT:
				_destroyDisplay();
				_toggleEdit();
				break
			default:
				break;
		}
		
	};
	
	var _toggleDisplay = function() {
		_editButton.show();
	};
	
	var _toggleEdit = function() {
	
		_saveButton = $('<button type=\'button\' class=\'btn btn-default save\' >'
					+ '<span class=\'glyphicon glyphicon-ok-circle\'></span>Save</button>');
					
		_cancelButton = $('<button type=\'button\' class=\'btn btn-default save\' >'
					+ '<span class=\'glyphicon glyphicon-remove-circle\'></span>Cancel</button>');	
					
		_saveButton.on('click', _save);
		_cancelButton.on('click', _cancel);
					
		_editButton.hide();			
		_saveSection.append(_saveButton);	
		_saveSection.append(_cancelButton);
			
	};
	
	var _destroyDisplay = function() {
	};
	
	var _destroyEdit = function() {
		
		if (_saveButton) {
			_saveButton.off();
			_saveButton.remove();
		}	
		
		if (_cancelButton){
			_cancelButton.off();
			_cancelButton.remove();		
		}	
		
	};
	
	var _save = function () {
		_toggleMode(Mode.DISPLAY);
	};
	
	var _cancel = function () {
		_toggleMode(Mode.DISPLAY);
	};
	
	$.fn.nofoodzadditionalinfo = function(options) {

		var self = this;		
		
		if (options)
			_options = $.extend(_options, options);		
			
		_enableUpdates = _options.update;		
		
		self.addClass('nofoodz-additionalinfo');
		
		_create(self);
		
		return self;

	};

}( jQuery ));