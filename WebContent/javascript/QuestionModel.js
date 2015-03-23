/**
 * 
 */
function QuestionModel(iPresenter) {
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
	var pi = 0;
	var iterations = 1;
	var trial = 1;

	var randomList = new Array();
	randomList = getList(3, 18, 3, true);
	var orderedList = new Array();
	orderedList = getList(3, 18, 3, false);

	var permutations = orderedList.concat(randomList);

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

	function getList(start, length, increment, random) {
		var list = new Array();
		var index = 0;

		for (var l = start; l <= length; l = l + increment) {
			for (var p = 0; p < l; p++) {
				list[index] = {
					random : random,
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
				index++;
			}
		}

		return shuffle(list);
	}

	QuestionModel.prototype.isCorrect = isCorrect;
	function isCorrect(value) {
		return value == solution;
	}

	QuestionModel.prototype.setSolution = setSolution;
	function setSolution(value) {
		solution = value;
	}

	QuestionModel.prototype.reset = reset;
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

	QuestionModel.prototype.recordResults = recordResults;
	function recordResults() {
		if (iterations % 3 == 1) {
			permutations[pi - 1].trial1 = responseTime;
			permutations[pi - 1].trial1Clicks = numberOfClicks;
			permutations[pi - 1].trial1Errors = numberOfErrors;
		} else if (iterations % 3 == 2) {
			permutations[pi - 1].trial2 = responseTime;
			permutations[pi - 1].trial2Clicks = numberOfClicks;
			permutations[pi - 1].trial2Errors = numberOfErrors;
		} else {
			permutations[pi - 1].trial3 = responseTime;
			permutations[pi - 1].trial3Clicks = numberOfClicks;
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
	function getResponseTime() {
		return responseTime;
	}

	QuestionModel.prototype.next = next;
	function next() {
		if (pi >= permutations.length / 2) {
			if (iterations < 3) {
				pi = 0;
				iterations++;
			} else if (iterations == 3) {
				iterations++;			
			} else if (pi >= permutations.length) {
				pi = permutations.length / 2;
				iterations++;
			}
		}
		reset();
	}

	QuestionModel.prototype.isDone = isDone;
	function isDone() {
		return done;
	}

	QuestionModel.prototype.stopTimer = stopTimer;
	function stopTimer() {
		done = true;
		responseTime = new Date().getTime() - start.getTime();
	}
}