/**
 * 
 */
function QuestionModel(iPresenter) {
	QuestionModel.prototype.isCorrect = isCorrect;
	QuestionModel.prototype.setSolution = setSolution;
	QuestionModel.prototype.reset = reset;
	QuestionModel.prototype.recordResults = recordResults;
	QuestionModel.prototype.getProgress = getProgress;
	QuestionModel.prototype.next = next;
	QuestionModel.prototype.stopTimer = stopTimer;

	var presenter = iPresenter;
	var solution = "";
	this.totalQuestions = 0;
	var start = 0;
	this.numberOfClicks = 0;
	this.numberOfErrors = 0;
	this.done = false;
	this.responseTime = 0;

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
					trial3 : 0
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
		this.numberOfClicks = 0;
		this.numberOfErrors = 0;
		this.done = false;
		this.responseTime = 0;
		start = new Date();
		presenter.setupQuestionnaire(permutations[pi].random, permutations[pi].length,
				permutations[pi].position);
		pi++;
	}

	function recordResults() {
		if (this.totalQuestions <= permutations.length) {
			permutations[pi - 1].trial1 = this.responseTime;
		} else if (this.totalQuestions <= permutations.length * 2) {
			permutations[pi - 1].trial2 = this.responseTime;
		} else {
			permutations[pi - 1].trial3 = this.responseTime;
		}

		participant.results = permutations;
		participant.update(function(e) {
			session.update(participant, function(e) {
				console.log("session updated");
			});
		});
	}

	function getProgress() {
		return (this.totalQuestions / (permutations.length * 3)) * 100;
	}

	function next() {
		if (pi >= permutations.length) {
			pi = 0;
		}
		reset();
	}

	function stopTimer() {
		this.done = true;
		this.responseTime = new Date().getTime() - start.getTime();
	}
}