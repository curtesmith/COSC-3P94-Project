/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);

var start = 0;
var numberOfClicks = 0;
var numberOfErrors = 0;
var totalQuestions = 0;
var done = false;
var solution = "";

var permutations = new Array();
var pi = 0;
for (var l = 3; l <= 6; l = l + 3) {
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
	window.onmousedown = mouseDown;
	setupQuestionnaire(true, permutations[pi].length, permutations[pi].position);
	pi++;

	attachRadioButtonEventHandlers();
	$("proceed").onclick = proceedClick;
	start = new Date();
}

function mouseDown(e) {
	if (!done) {
		clearMessage();
		numberOfClicks++;
	}
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

	$("proceed").disabled = true;

	totalQuestions++;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
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
	div.appendChild(radio);
	div.appendChild(text);
	container.appendChild(div);
}

function attachRadioButtonEventHandlers() {
	var radios = $name("answer");
	for (var i = 0; i < radios.length; i++) {
		radios[i].onchange = radioAnswerSelected;
	}
}

function proceedClick(e) {
	if (pi >= permutations.length) {
		pi = 0;
	}
	setup();
}

function disableRadioButtons() {
	var radios = $name("answer");
	for (var i = 0; i < radios.length; i++) {
		radios[i].disabled = true;
	}
}

function clearMessage() {
	$("message").innerHTML = "";
}

function radioAnswerSelected(e) {
	if (isCorrect(e.target.value)) {
		done = true;
		var responseTimeInMilliseconds = new Date().getTime() - start.getTime();
		showSuccess(responseTimeInMilliseconds);
		disableRadioButtons();
		recordResults(responseTimeInMilliseconds);
		showProgress();
		showResults();
		if (totalQuestions < (permutations.length * 3))
			enableProceedButton();
	} else {
		showError();
		numberOfErrors++;
		// record the error in the database
	}
}

function recordResults(time) {
	if (totalQuestions <= permutations.length) {
		permutations[pi - 1].trial1 = time;
	} else if (totalQuestions <= permutations.length * 2) {
		permutations[pi - 1].trial2 = time;
	} else {
		permutations[pi - 1].trial3 = time;
	}
}

function isCorrect(value) {
	return value == solution;
}

function showProgress() {
	var percent = (totalQuestions / (permutations.length * 3)) * 100;
	$("progress_bar").style.width = percent + "%";
}

function showResults() {
	var results = "Order,Number Of Items,Position,Trial #1,Trial #2,Trial #3 <br />";
	for (var i = 0; i < permutations.length; i++) {
		results += "Random," + permutations[i].length + ","
				+ (permutations[i].position + 1) + "," + permutations[i].trial1
				+ "," + permutations[i].trial2 + "," + permutations[i].trial3
				+ "<br />";
	}
	$("results").innerHTML = results;
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

function enableProceedButton() {
	$("proceed").disabled = false;
}