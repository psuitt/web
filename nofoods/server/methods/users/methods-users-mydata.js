Meteor.methods({
	
	getUserNotifications: function () {
		
		if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");		
		
		var profile = Meteor.user().profile;
					
  	return profile.notifications;
  	
	}

});