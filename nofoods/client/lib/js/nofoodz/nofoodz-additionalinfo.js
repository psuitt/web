/*
		Additional Info jquery widget.
 */
(function ( $ ) {
	
	var Mode = {
		INITIAL : 'i',
		DISPLAY : 'd',
		EDIT : 'e'
	};
	
	var _mode = Mode.INITIAL,
			_enableUpdates = false,
			SubTypes = {
				DEFAULT: 'default' 			
			},
			FieldTypes = {
				COMBO: 'COMBO' 			
			},
			SubTypesFieldLists = {},
			Fields = {};
	
	var _options = {
			type: 'food',
			info: {
				subtype: SubTypes.DEFAULT
			},
			update: false,
			save: false
		};
	
	/* Sections */		
	var _header,
			_displaySection,
			_saveSection;
	
	/* Buttons */	
	
	var _editButton,
			_saveButton,
			_cancelButton;
	
	var _create = function(self) {
		
		_header = $('<div class=\'info-header\'>Info</div>');
		
		if (_enableUpdates) {
			_editButton = $('<button type=\'button\' class=\'btn btn-default edit\' >'
					+ '<span class=\'glyphicon glyphicon-edit\'></span>Click to edit info</button>');
			_editButton.on('click', function() {_toggleMode(Mode.EDIT);});
			_header.append(_editButton);
		}
		
		self.append(_header);
		
		_displaySection = $('<div class=\'display-section\'></div>');
		
		self.append(_displaySection);
		
		_saveSection = $('<div class=\'save-section\'></div>');
		
		self.append(_saveSection);
		
		_toggleMode(Mode.DISPLAY);
			
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

		_appendDisplays();		
		
	};
	
	var _toggleEdit = function() {
		
		_appendEdits();
	
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
		
		_clearDisplaySection();
		
	};
	
	var _destroyEdit = function() {
		
		_clearDisplaySection();
		
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
		
		_updateInfo();
		
		_toggleMode(Mode.DISPLAY);
		
		var obj = {
			_id: _options._id,
			type: _options.type,
			info: _options.info
		};
		
		Meteor.call('updateFoodDrinkInfo', obj, _saveComplete);
		
	};
	
	var _saveComplete = function(err, data) {
	
		if (err) {
			alert(err);
			return;
		}
	
		alert("Saved!");
		
	
	};
	
	var _cancel = function () {
		_toggleMode(Mode.DISPLAY);
	};
	
	var _updateInfo = function () {
		_displaySection.find('.nofoodz-field').each(function() {
			
			var infoType = $(this).attr('info-type'),
					infoValue = $(this).attr('info-value');
					
			_options.info[infoType] = infoValue;
		
		});
	};
	
	var _appendDisplays = function() {
		
		var column1 = $('<ul class=\'column\'></ul>');
		
		var info = _options.info;
		
		// Add fields
		if (_options.info.subtype in SubTypesFieldLists) {
			
			for (var i = 0, length = SubTypesFieldLists[_options.info.subtype].length ; i < length ; i += 1) {
				
				var field = SubTypesFieldLists[_options.info.subtype][i],
						fieldElement;
				
				if (field.display && field.field in info) {
					fieldElement = field.display.call(field, info[field.field]);	
				}
				
				if (fieldElement) {
					column1.append(fieldElement);	
				}
				
			}			
			
		}
		
		_displaySection.append(column1);
		
	};
	
	var _appendEdits = function() {
	
		// Add fields
		if (_options.info.subtype in SubTypesFieldLists) {
			
			
			for (var i = 0, length = SubTypesFieldLists[_options.info.subtype].length ; i < length ; i += 1) {
				
				var field = SubTypesFieldLists[_options.info.subtype][i],
						fieldElement;
				
				if (field.create) {
					fieldElement = field.create.call(field, _options.type);	
				}
				
				if (fieldElement) {
					_displaySection.append(fieldElement);	
				}
				
			}			
			
		}
	
	};
	
	var _clearDisplaySection = function() {
	
		// Remove all listeners
		_displaySection.find('.nofoodz-combo li a').off()
		
		// Remove all elements
		
		// Clear html	
		_displaySection.html('');
	
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
	
	// Widget creation functions
	var _createCombo = function(list) {
		
		var combo = NoFoods.widgetlib.createEmptySelect();
		
		combo.addClass('nofoodz-field')
				 .attr('info-type', this.field)
				 .attr('info-value', list[0]);
		combo.find('.text').html(list[0]);
		
		// Add the options now.
		for (var i = 0, length = list.length ; i < length ; i += 1) {
			var li = $('<li></li>'),
					a = $('<a></a>');
					
			a.html(list[i]);	
			li.append(a);
			combo.find('.dropdown-menu').append(li);
			
		}
		
		combo.find('.dropdown-menu').on('click', 'a', function(e) {
			var val = e.target.innerHTML;
			combo.find('.text').html(val);
			combo.attr('info-value', val);
		});
		
		return combo;
		
	};
	
	// Create Display Functions
	
	var _basicDisplayCreate = function(val) {
			var li = $('<li></li>');	
			var camelCase = NoFoodz.format.camelCase(val);
			li.html(camelCase);		
			return li;
	};
	
	// Create Edit Functions
	
	var _subtypeCreate = function(type) {
		
		if (type === 'food') {
			return _createCombo.call(this, this.optionsFood);		
		} else if (type === 'drink') {
			return _createCombo.call(this, this.optionsDrink);		
		}
	
	};
	
	// Static Setup for Fields
	
	Fields['subtype'] = { 
		field: 'subtype',
		type: FieldTypes.COMBO, 
		create: _subtypeCreate,
		display: _basicDisplayCreate,
		optionsFood: ['Default'],
		optionsDrink: ['Default', 'Alcohol'] };
	
	SubTypesFieldLists[SubTypes.DEFAULT] = [
			Fields['subtype']
	];

}( jQuery ));