Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.map(function () {

	this.route('home', {
    path:'/',
    template: 'home',
		layoutTemplate: 'mainLayout',
    before: function () {
    }
  });

	this.route('home', {
    path:'/foods/add',
    template: 'foodsAdd',
		layoutTemplate: 'mainLayout',
    before: function () {
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
