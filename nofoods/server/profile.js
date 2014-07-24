Accounts.config({ 
	sendVerificationEmail: true,
	loginExpirationInDays: 90
});

// Validate username, sending a specific error message on failure.
Accounts.validateNewUser(function (user) {
    if (user.username && user.username.length >= 3)
        return true;
    throw new Meteor.Error(403, "Username must have at least 3 characters");
});
// Validate username, without a specific error message.
Accounts.validateNewUser(function (user) {
    return user.username !== "root";
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

Accounts.emailTemplates.siteName = "No-Foods";
Accounts.emailTemplates.from = "No-Foods Admin <accounts@no-foods.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to No-Foods, " + user.profile.username;
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return " To activate your account, simply click the link below:\n\n"
     + url;
};