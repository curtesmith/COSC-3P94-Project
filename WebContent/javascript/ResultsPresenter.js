/**
 * 
 */

function ResultsPresenter(view) {
	var _view = view;
	this.window = _view.window;
	ResultsPresenter.prototype.ready = ready;
	ResultsPresenter.prototype.renderResults = renderResults;

	var model = new ResultsModel(this);

	function ready() {
		model.ready();
	}

	function renderResults(participant) {
		var results = "id,Order,Number Of Items,Position,Trial #1,Trial #2,Trial #3 <br />";

		for (var i = 0; i < participant.results.length; i++) {
			results += participant.id + "," + "Random,"
					+ participant.results[i].length + ","
					+ (participant.results[i].position + 1) + ","
					+ participant.results[i].trial1 + ","
					+ participant.results[i].trial2 + ","
					+ participant.results[i].trial3 + "<br />";
		}

		_view.setResults(results);
	}
}