/**
 * 
 */
function ResultsModel(iPresenter) {
	var presenter = iPresenter;
	ResultsModel.prototype.ready = ready;
	ResultsModel.prototype.showResults = showResults;

	function ready() {
		database = new Database();
		database.connectWithCallback(presenter.window, function(e) {
			showResults();
		});
	}

	function showResults() {
		var session = new Session(database);

		session.get(function(e) {
			if (e.target.result) {
				var participant = new Participant(database);
				participant.fill(e.target.result.value);
				presenter.renderResults(participant);
			}

		});
	}
}