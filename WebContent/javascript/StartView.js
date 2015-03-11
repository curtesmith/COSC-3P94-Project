/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);
var view = null;

function setup() {
	view = new StartView();
	view.attachEventHandlers();
}

function StartView() {
	StartView.prototype.attachEventHandlers = attachEventHandlers;
	StartView.prototype.startClicked = startClicked;
	StartView.prototype.continueClicked = continueClicked;
	StartView.prototype.alert = alert;
	StartView.prototype.window = window;
	StartView.prototype.gotoQuestions = gotoQuestions;

	var presenter = new StartPresenter(this);
	
	function continueClicked(e) {
		presenter.continueClicked(getEmail());
	}

	function startClicked(e) {

		presenter.startClicked(getEmail());
	}
	
	function getEmail() {
		return $("email_textbox").value;
	}

	function attachEventHandlers() {
		$("start_button").onclick = startClicked;
		$("continue_button").onclick = continueClicked;
	}
	
	function alert(message) {
		this.window.alert(message);
	}
	
	function gotoQuestions() {
		location.replace("Question.html");
	}
}
