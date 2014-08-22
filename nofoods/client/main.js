if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
}

Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.map(function () {

	this.route('error404', {
    path:'/404',
    template: 'error404',
		layoutTemplate: 'mainLayout'
  });

	this.route('home', {
    path:'/',
    template: 'home',
		layoutTemplate: 'mainLayout'
  });
  
  this.route('searchResultsEmpty', {
    path: '/search/:type/',
    template: 'search',
		layoutTemplate: '',
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    }
	});

	this.route('searchResults', {
    path: '/search/:type/:search',
    template: 'search',
		layoutTemplate: '',
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    }
	});
	
	this.route('results', {
    path: '/results/:type/:search',
    template: 'results',
		layoutTemplate: 'mainLayout',
    yieldTemplates: {
			'footer': {to: 'footer'}		
		},
		onAfterAction: function() {
			DoSearchFlag && DoSearch(this.params.type, this.params.search);
		},
		data: function() {
			return this.params;
		}
	});

	this.route('myfoods', {
    path:'/myfoods',
    template: 'myfoods',
		layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		}
  });

	this.route('add', {
    path:'/food/add/:brand_id?',
    template: 'foodsAdd',
		layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {
    },
		data: function() {
			return this.params;
		}
  });
  
  this.route('addRecipe', {
    path:'/food/addrecipe',
    template: 'addRecipe',
		layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {
    },
		data: function() {
		
		}
  });
  
  this.route('foods', {
    path: '/pages/:type/:_id',
    template: 'foods',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    },
    data: function() {
			return {type: this.params.type.substring(0, 1).toUpperCase() + this.params.type.substring(1)};
		}
	});

	this.route('foodsPage', {
    path: '/food/page/:_id',
    template: 'foodsTemplate',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    }
	});

	this.route('drinksPage', {
    path: '/drink/page/:_id',
    template: 'drinksTemplate',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    }
	});

	this.route('brandsPage', {
    path: '/brand/page/:_id',
    template: 'brandsTemplate',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    },
		data: function() {
			return {brand_id: this.params._id};
		}
	});
	
	this.route('explore', {
    path: '/explore',
    template: 'explore',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		}
	});
	
	this.route('explore', {
    path: '/explore/:maptype',
    template: 'explore',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    }
	});
	
	this.route('peoplesPage', {
    path: '/people/page/:username',
    template: 'people',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {	  
			PARAMS = this.params;   
    }
	});

});

