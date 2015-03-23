/**
 * 
 */

function ResultsPresenter(iView) {
	var view = iView;
	this.window = view.window;
	ResultsPresenter.prototype.ready = ready;
	ResultsPresenter.prototype.renderResults = renderResults;

	var model = new ResultsModel(this);

	function ready() {
		model.ready();
	}

	function renderResults(participant) {
		var results = "id,Order,Number Of Items,Position,"
				+ "Trial #1 Response Time,Trial #2 Response Time,Trial #3 Response Time, "
				+ "Trial #1 Number of Clicks, Trial #2 Number of Clicks, Trial #3 Number of Clicks, "
				+ "Trial #1 Number of Errors, Trial #2 Number of Errors, Trial #3 Number of Errors "
				+ "<br />";
		var order = "";

		for (var i = 0; i < participant.results.length; i++) {
			if (participant.results[i].random) {
				order = "Random";
			} else {
				order = "Alphabetic";
			}
			results += participant.id + "," + order + ","
					+ participant.results[i].length + ","
					+ (participant.results[i].position + 1) + ","
					+ participant.results[i].trial1 + ","
					+ participant.results[i].trial2 + ","
					+ participant.results[i].trial3 + ","
					+ participant.results[i].trial1Clicks + ","
					+ participant.results[i].trial2Clicks + ","
					+ participant.results[i].trial3Clicks + ","
					+ participant.results[i].trial1Errors + ","
					+ participant.results[i].trial2Errors + ","
					+ participant.results[i].trial3Errors + "<br />";
		}

		view.setResults(results);
	}
}