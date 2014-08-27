Template._loginButtonsLoggedInDropdown.events({
		'click #login-buttons-edit-profile': function(event) {
        Template._loginButtons.toggleDropdown();
        Router.go('myfoods');
    }
});

Template.loginButtons.rendered = function () {
	
};

Template.loginButtons.events({
	
	'keyup, blur #login-username-or-email'	: function(event, template) {
		template.find('#login-username-or-email').value = template.find('#login-username-or-email').value.toLowerCase();	
	}

}); 