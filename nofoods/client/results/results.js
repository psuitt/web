DoSearchFlag = false;

Template.results.rendered = function() {
	setPath();
	var data = Router.getData();
	DoSearch(data.type, data.search);
	DoSearchFlag = true;
};

Template.results.destroyed = function() {
	DoSearchFlag = false;
};