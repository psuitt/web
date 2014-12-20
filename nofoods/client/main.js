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
  
  this.route('admin', {
    path:'/admin',
    template: 'admin',
		layoutTemplate: 'mainLayout'
  });
  
  this.route('reported', {
    path:'/admin/reported',
    template: 'reported',
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

	this.route('myfoodz', {
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
			this.next(); 
    },
    data: function() {
			return {
				id: this.params._id,
				type: this.params.type.substring(0, 1).toUpperCase() + this.params.type.substring(1)
				};
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
			this.next();   
    },
		data: function() {
			return {brand_id: this.params._id};
		}
	});
	
	this.route('random', {
    path:'/food/random',
    template: 'random',
		layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
		data: function() {
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
	
	this.route('explore-maptype', {
    path: '/explore/:maptype',
    template: 'explore',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    onBeforeAction: function () {	  
			PARAMS = this.params;   
			this.next();
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
			this.next();  
    }
	});

});

