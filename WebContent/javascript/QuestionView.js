/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);
var view = null;

function QuestionView() {
	QuestionView.prototype.attachEventHandlers = attachEventHandlers;
	QuestionView.prototype.attachRadioButtonEventHandlers = attachRadioButtonEventHandlers;
	QuestionView.prototype.radioAnswerSelected = radioAnswerSelected;
	QuestionView.prototype.mouseDown = mouseDown;
	QuestionView.prototype.proceedClick = proceedClick;
	QuestionView.prototype.resultsButtonClick = resultsButtonClick;
	QuestionView.prototype.enableProceedButton = enableProceedButton;
	QuestionView.prototype.enableResultsButton = enableResultsButton;
	QuestionView.prototype.clearMessage = clearMessage;
	QuestionView.prototype.showSuccess = showSuccess;
	QuestionView.prototype.showError = showError;
	QuestionView.prototype.disableRadioButtons = disableRadioButtons;
	QuestionView.prototype.appendQuestion = appendQuestion;
	QuestionView.prototype.appendChoice = appendChoice;
	QuestionView.prototype.setupQuestionnaire = setupQuestionnaire;
	QuestionView.prototype.showProgress = showProgress;

	function mouseDown(e) {
		if (!done) {
			clearMessage();
			numberOfClicks++;
		}
	}
	
	function proceedClick(e) {
		if (pi >= permutations.length) {
			pi = 0;
		}
		reset();
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
		if (isCorrect(e.target.value)) {
			done = true;
			var responseTimeInMilliseconds = new Date().getTime() - start.getTime();
			showSuccess(responseTimeInMilliseconds);
			disableRadioButtons();
			recordResults(responseTimeInMilliseconds);
			showProgress();
			if (totalQuestions < (permutations.length * 3)) {
				enableProceedButton();
			} else {
				enableResultsButton();
			}
		} else {
			showError();
			numberOfErrors++;
			// record the error in the database
		}
	}
	
	function enableProceedButton() {
		$("proceed").style.visibility = "visible";
	}
	
	function enableResultsButton() {
		$("results_button").style.visibility = "visible";
	}
	
	function clearMessage() {
		$("message").innerHTML = "";
	}
	
	function showSuccess(time) {
		$("message").className = "success";
		$("message").innerHTML = "Success, time=[" + time + "], number of errors=["
				+ numberOfErrors + "], number of clicks=[" + numberOfClicks + "]";
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
	
	function appendQuestion(container, word) {
		solution = word;
		var question = $create("div");
		question.innerHTML = "Select the option with the word, \"" + word + "\".";
		container.appendChild(question);
	}
	
	function appendChoice(container, choice) {
		var div = $create("div");
		var radio = $create("input");
		radio.setAttribute("name", "answer");
		radio.setAttribute("type", "radio");
		radio.setAttribute("value", choice);
		var text = $createText(choice);
		div.appendChild(text);
		div.appendChild(radio);

		div.setAttribute("class", "choice");
		container.appendChild(div);
	}
	
	function setupQuestionnaire(scramble, length, position) {
		var choices = [ "anchor", "button", "camping", "dancer", "feather",
				"igloo", "kangaroo", "lion", "maple", "north", "panda", "study",
				"television", "umbrella", "victory", "watermelon", "yankee",
				"zebra" ];

		if (scramble) {
			choices = shuffle(choices);
		}

		$("question").innerHTML = "";

		appendQuestion($("question"), choices[position]);

		for (var i = 0; i < length; i++) {
			appendChoice($("question"), choices[i]);
		}

		clearMessage();

		$("proceed").style.visibility = "hidden";

		totalQuestions++;
	}
	
	function showProgress() {
		var percent = (totalQuestions / (permutations.length * 3)) * 100;
		$("progress_bar").style.width = percent + "%";
	}
}

var start = 0;
var numberOfClicks = 0;
var numberOfErrors = 0;
var totalQuestions = 0;
var done = false;
var solution = "";
var database = null;
var session = null;
var participant = null;

var permutations = new Array();
var pi = 0;
for (var l = 3; l <= 3; l = l + 3) {
	for (var p = 0; p < l; p++) {
		permutations[pi] = {
			length : l,
			position : p,
			trial1 : 0,
			trial2 : 0,
			trial3 : 0
		};
		pi++;
	}
}

permutations = shuffle(permutations);
pi = 0;

function setup() {
	view = new QuestionView();
	view.attachEventHandlers();
	
	database = new Database(window);
	database.connectWithCallback(window, function(e) {
		session = new Session(database);

		session.get(function(e) {
			if (e.target.result) {
				participant = new Participant(database);
				participant.fill(e.target.result.value);
				participant.results = permutations;
				reset();
			}

		});
	});
}

function reset() {
	numberOfClicks = 0;
	numberOfErrors = 0;
	done = false;
	view.setupQuestionnaire(true, permutations[pi].length, permutations[pi].position);
	pi++;
	view.attachRadioButtonEventHandlers();
	start = new Date();
}

function recordResults(time) {
	if (totalQuestions <= permutations.length) {
		permutations[pi - 1].trial1 = time;
	} else if (totalQuestions <= permutations.length * 2) {
		permutations[pi - 1].trial2 = time;
	} else {
		permutations[pi - 1].trial3 = time;
	}

	participant.results = permutations;
	participant.update(function(e) {
		session.update(participant, function(e) {
			console.log("session updated");
		});
	});
}

function isCorrect(value) {
	return value == solution;
}