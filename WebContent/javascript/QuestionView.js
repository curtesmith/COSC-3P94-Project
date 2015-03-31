/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);
var view = null;

function setup() {
	view = new QuestionView();
	view.attachEventHandlers();
}

function QuestionView() {
	QuestionView.prototype.attachEventHandlers = attachEventHandlers;
	QuestionView.prototype.attachRadioButtonEventHandlers = attachRadioButtonEventHandlers;
	QuestionView.prototype.radioAnswerSelected = radioAnswerSelected;
	QuestionView.prototype.mouseDown = mouseDown;
	QuestionView.prototype.proceedClick = proceedClick;
	QuestionView.prototype.resultsButtonClick = resultsButtonClick;
	QuestionView.prototype.enableProceedButton = enableProceedButton;
	QuestionView.prototype.disableProceedButton = disableProceedButton;
	QuestionView.prototype.enableResultsButton = enableResultsButton;
	QuestionView.prototype.clearMessage = clearMessage;
	QuestionView.prototype.showSuccess = showSuccess;
	QuestionView.prototype.showError = showError;
	QuestionView.prototype.disableRadioButtons = disableRadioButtons;
	QuestionView.prototype.appendQuestion = appendQuestion;
	QuestionView.prototype.appendChoice = appendChoice;
	QuestionView.prototype.showProgress = showProgress;
	QuestionView.prototype.window = window;
	QuestionView.prototype.clearQuestion = clearQuestion;

	var presenter = new QuestionPresenter(this);

	function mouseDown(e) {
		presenter.mouseDown();
	}

	function proceedClick(e) {
		presenter.proceedClick();
	}

	function resultsButtonClick() {
		location.replace("Results.html");
	}

	function attachEventHandlers() {
		window.onmousedown = mouseDown;
		$("proceed").onclick = proceedClick;
		$("results_button").onclick = resultsButtonClick;
	}

	function attachRadioButtonEventHandlers() {
		var radios = $name("answer");
		for (var i = 0; i < radios.length; i++) {
			radios[i].onchange = radioAnswerSelected;
		}
	}

	function radioAnswerSelected(e) {
		presenter.radioAnswerSelected(e.target.value);
	}

	function enableProceedButton() {
		$("proceed").style.visibility = "visible";
	}

	function disableProceedButton() {
		$("proceed").style.visibility = "hidden";
	}

	function enableResultsButton() {
		$("results_button").style.visibility = "visible";
	}

	function clearMessage() {
		$("message").innerHTML = "";
	}

	function showSuccess(time, numberOfClicks, numberOfErrors) {
		$("message").className = "success";
		$("message").innerHTML = "Success, time=[" + time
				+ "], number of errors=[" + numberOfErrors
				+ "], number of clicks=[" + numberOfClicks + "]";
	}

	function showError() {
		$("message").className = "error";
		$("message").innerHTML = "That is not the correct option. Try again.";
	}

	function disableRadioButtons() {
		var radios = $name("answer");
		for (var i = 0; i < radios.length; i++) {
			radios[i].disabled = true;
		}
	}

	function appendQuestion(word, order) {
		var question = $create("div");
		question.innerHTML = "Select the option with the word, \"" + word
				+ "\" from the " + order + " ordered list.";
		$("question").appendChild(question);
	}

	function appendChoice(choice) {
		var div = $create("div");
		var radio = $create("input");
		radio.setAttribute("name", "answer");
		radio.setAttribute("type", "radio");
		radio.setAttribute("value", choice);
		var text = $createText(choice);
		div.appendChild(text);
		div.appendChild(radio);

		div.setAttribute("class", "choice");
		$("question").appendChild(div);
	}

	function showProgress(percent) {
		$("progress_bar").style.width = percent + "%";
		$("progress_bar").innerHTML = Math.floor(percent) + "%";
	}

	function clearQuestion() {
		$("question").innerHTML = "";
	}
}