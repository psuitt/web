recalcFrame = function(height) {
	if ($('#results-searchresults')[0].height < height) {
		$('#results-searchresults')[0].height = height;
	}
};

Template.results.rendered = function() {
	setPath();
};