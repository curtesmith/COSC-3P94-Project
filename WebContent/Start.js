/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);

var database = null;
var session = null;

function setup() {
	database = new Database(window);
	database.connect(window);
	session = new Session(database);
	$("start").onclick = startClicked;
	$("continue").onclick = continueClicked;
}

function startClicked(e) {
	var participant = new Participant(database);
	participant.id = $("email").value;
	participant.result = null;
	participant.add(function(e) {
		session.update(participant, function(e) {
			gotoQuestions(participant);
		});
	});
}

function continueClicked(e) {
	var participant = new Participant(database);
	participant.getById($("email").value, function(e) {
		if (e.target.result) {
			gotoQuestions(e.target.result);
		} else {
			alert("no match on email");
		}
	});
}

function gotoQuestions(participant) {
	session.update(participant, function(e) {
		location.replace("Question.html");
	});

}