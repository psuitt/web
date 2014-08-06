DoSearchFlag = false;

Template.results.rendered = function() {
	setPath();
	var data = this.data;
	DoSearch(data.type, data.search);
	DoSearchFlag = true;
};

Template.results.destroyed = function() {
	DoSearchFlag = false;
};