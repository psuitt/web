if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
}

Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.map(function () {

	this.route('home', {
    path:'/',
    template: 'home',
		layoutTemplate: 'mainLayout'
  });

	this.route('searchResults', {
    path: '/search/:type/:search',
    template: 'search',
		layoutTemplate: '',
    before: function () {	  
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
		data: function() {
			return { "src": '/search/' + this.params.type + "/" + this.params.search };
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

	this.route('error404', {
    path:'/404',
    template: 'error404',
		layoutTemplate: 'mainLayout'
  });

	this.route('add', {
    path:'/food/add',
    template: 'foodsAdd',
		layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    before: function () {
    }
  });

	this.route('foodsPage', {
    path: '/food/page/:_id',
    template: 'foodsTemplate',
    layoutTemplate: 'mainLayout',
		yieldTemplates: {
			'footer': {to: 'footer'}		
		},
    before: function () {	  
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
    before: function () {	  
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
    before: function () {	  
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
    before: function () {	  
			PARAMS = this.params;   
    }
	});

  this.route('parties', {
    path:'/parties',
    template: 'page',
		layoutTemplate: 'mainLayout',
    before: function () {
      Meteor.subscribe("directory");
      Meteor.subscribe("parties");
      Deps.autorun(function () {
			  var selected = Session.get("selected");
			  if (! selected || ! Parties.findOne(selected)) {
			    var party = Parties.findOne();
					if (party)
						Session.set("selected", party._id);
					else
						Session.set("selected", null);
				}
			});
    }
  });

});

