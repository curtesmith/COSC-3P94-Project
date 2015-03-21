/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);
var view = null;

function setup() {
	view = new ResultsView();
	view.ready();
}

function ResultsView() {
	ResultsView.prototype.setResults = setResults;
	ResultsView.prototype.ready = ready;
	this.window = window;

	var presenter = new ResultsPresenter(this);

	function ready() {
		presenter.ready();
	}

	function setResults(results) {
		$("results").innerHTML = results;
	}
}
