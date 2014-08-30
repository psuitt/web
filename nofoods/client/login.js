Template._loginButtonsLoggedInDropdown.events({
		'click #login-buttons-profile': function(event) {
				event.stopPropagation();
        Template._loginButtons.toggleDropdown();
        Router.go('myfoodz');
    }
});