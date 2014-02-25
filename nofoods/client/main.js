Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.map(function () {

	this.route('home', {
    path:'/',
    template: 'home',
		layoutTemplate: 'mainLayout',
    before: function () {
			Meteor.subscribe("foods");
    }
  });

	this.route('home', {
    path:'/foods/add',
    template: 'foodsAdd',
		layoutTemplate: 'mainLayout',
    before: function () {
    }
  });

	this.route('foodsPage', {
    path: '/foods/:_id',
    template: 'foodsTemplate',
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    before: function () {
      if (!Meteor.user()) {
              // render the login template but keep the url in the browser the same
              //this.render('login');

              // stop the rest of the before hooks and the action function 
              //this.stop();
      }       
    },
    
    waitOn: function () {
			return Meteor.subscribe('foods');
    },
    
    data: function () {
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
