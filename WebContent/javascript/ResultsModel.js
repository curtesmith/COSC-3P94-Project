/**
 * 
 */
function ResultsModel(presenter) {
	var _presenter = presenter;
	ResultsModel.prototype.ready = ready;
	ResultsModel.prototype.showResults = showResults;

	function ready() {
		database = new Database();
		database.connectWithCallback(_presenter.window, function(e) {
			showResults();
		});
	}

	function showResults() {
		var session = new Session(database);

		session.get(function(e) {
			if (e.target.result) {
				var participant = new Participant(database);
				participant.fill(e.target.result.value);
				_presenter.renderResults(participant);
			}

		});
	}
}