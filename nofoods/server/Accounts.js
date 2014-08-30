Accounts.config({ 
	sendVerificationEmail: true,
	loginExpirationInDays: 2
});

// Validate username, sending a specific error message on failure.
Accounts.validateNewUser(function (user) {
	
	var settings = Settings.findOne({'_type' : 'accounts'});
	
	if (settings) {
		if (settings.disableUserCreate)
			throw new Meteor.Error(500, "Username creation is currently disabled");
		if (settings.specialPrefix && settings.specialPrefix !== '') {
			if (user.username.indexOf(settings.specialPrefix) === 0) {
				user.username = user.username.replace(settings.specialPrefix, '');			
			}	else {
				throw new Meteor.Error(500, "Username creation is currently disabled");
			}
		}
	}
	
	if (user.username && user.username.length > 3 && user.username.length < 16) {
		check(user.username, NonEmptyStringNoSpaceCharacters);
		// Lower case only.
		user.username = user.username.toLowerCase();
		Statistics.update(
			{_type: 'usercount'}, 
			{ $inc: { count: 1 } }
		);
	  return true;
	}
	
	throw new Meteor.Error(403, "Username must have at least 4-15 alphanumeric characters");
});

Accounts.onCreateUser(function(options, user) {
	user.active = true;	
	user.profile = {
		bonusHearts: 10,
		date: new Date(),
		achievements: [NoFoods.achievements.updateAchievement('NEW').updates[0].updated]	
	};
	return user;
});

// EMAIL CODE

Accounts.emailTemplates.siteName = "NoFoodz";
Accounts.emailTemplates.from = "NoFoodz Accounts <accounts@nofoodz.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to No-Foods, " + user.profile.username;
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return " To activate your account, simply click the link below:\n\n"
     + url;
};