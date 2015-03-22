/**
 * 
 */
function QuestionModel(iPresenter) {
	QuestionModel.prototype.isCorrect = isCorrect;
	QuestionModel.prototype.setSolution = setSolution;
	QuestionModel.prototype.reset = reset;
	QuestionModel.prototype.recordResults = recordResults;
	QuestionModel.prototype.next = next;
	QuestionModel.prototype.stopTimer = stopTimer;
	QuestionModel.prototype.isDone = isDone;

	var presenter = iPresenter;
	var solution = "";
	var totalQuestions = 0;
	var start = 0;
	var numberOfClicks = 0;
	var numberOfErrors = 0;
	var done = false;
	var responseTime = 0;

	var database = null;
	var session = null;
	var participant = null;

	var permutations = new Array();
	var pi = 0;

	for (var r = 0; r < 2; r++) {
		for (var l = 3; l <= 3; l = l + 3) {
			for (var p = 0; p < l; p++) {
				permutations[pi] = {
					random : r == 0,
					length : l,
					position : p,
					trial1 : 0,
					trial2 : 0,
					trial3 : 0,
					trial1Clicks : 0,
					trial1Errors : 0,
					trial2Clicks : 0,
					trial2Errors : 0,
					trial3Clicks : 0,
					trial3Errors : 0
				};
				pi++;
			}
		}
	}

	permutations = shuffle(permutations);
	pi = 0;

	database = new Database();
	database.connectWithCallback(presenter.window, function(e) {
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

	function isCorrect(value) {
		return value == solution;
	}

	function setSolution(value) {
		solution = value;
	}

	function reset() {
		numberOfClicks = 0;
		numberOfErrors = 0;
		done = false;
		responseTime = 0;
		start = new Date();
		presenter.setupQuestionnaire(permutations[pi].random,
				permutations[pi].length, permutations[pi].position);
		pi++;
	}

	function recordResults() {
		if (totalQuestions <= permutations.length) {
			permutations[pi - 1].trial1 = responseTime;
			permutations[pi - 1].trail1Clicks = numberOfClicks;
			permutations[pi - 1].trial1Errors = numberOfErrors;
		} else if (totalQuestions <= permutations.length * 2) {
			permutations[pi - 1].trial2 = responseTime;
			permutations[pi - 1].trail2Clicks = numberOfClicks;
			permutations[pi - 1].trial2Errors = numberOfErrors;
		} else {
			permutations[pi - 1].trial3 = responseTime;
			permutations[pi - 1].trail3Clicks = numberOfClicks;
			permutations[pi - 1].trial3Errors = numberOfErrors;
		}

		participant.results = permutations;
		participant.update(function(e) {
			session.update(participant, function(e) {
				console.log("session updated");
			});
		});
	}
	
	QuestionModel.prototype.incrementTotalQuestions = incrementTotalQuestions;
	function incrementTotalQuestions() {
		totalQuestions++;
	}
	
	QuestionModel.prototype.incrementNumberOfClicks = incrementNumberOfClicks;

	function incrementNumberOfClicks() {
		numberOfClicks++;
	}
	
	QuestionModel.prototype.incrementNumberOfErrors = incrementNumberOfErrors;
	function incrementNumberOfErrors() {
		numberOfErrors++;
	}
	
	QuestionModel.prototype.getProgress = getProgress;
	function getProgress() {
		return (totalQuestions / (permutations.length * 3)) * 100;
	}
	
	QuestionModel.prototype.getNumberOfErrors = getNumberOfErrors;	
	function getNumberOfErrors() {
		return numberOfErrors;
	}
	
	QuestionModel.prototype.getNumberOfClicks = getNumberOfClicks;	
	function getNumberOfClicks() {
		return numberOfClicks;
	}
	
	QuestionModel.prototype.getResponseTime = getResponseTime;	
	function getResponseTime(){
		return responseTime;
	}

	function next() {
		if (pi >= permutations.length) {
			pi = 0;
		}
		reset();
	}

	function isDone() {
		return done;
	}

	function stopTimer() {
		done = true;
		responseTime = new Date().getTime() - start.getTime();
	}
}