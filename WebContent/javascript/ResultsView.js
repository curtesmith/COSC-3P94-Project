/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	var view = new ResultsView();
	view.ready();
}

function ResultsView() {
	ResultsView.prototype.setResults = setResults;
	ResultsView.prototype.ready = ready;
	this.window = window;

	var _presenter = new ResultsPresenter(this);

	function ready() {
		_presenter.ready();
	}

	function setResults(results) {
		$("results").innerHTML = results;
	}
}
