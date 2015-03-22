/**
 * 
 */
function QuestionPresenter(iView) {
	QuestionPresenter.prototype.setupQuestionnaire = setupQuestionnaire;
	QuestionPresenter.prototype.radioAnswerSelected = radioAnswerSelected;
	QuestionPresenter.prototype.proceedClick = proceedClick;
	QuestionPresenter.prototype.mouseDown = mouseDown;

	var view = iView;
	this.window = view.window;
	var model = new QuestionModel(this);

	function setupQuestionnaire(random, length, position) {
		var choices = [ "anchor", "button", "camping", "dancer", "feather",
				"igloo", "kangaroo", "lion", "maple", "north", "panda",
				"study", "television", "umbrella", "victory", "watermelon",
				"yankee", "zebra" ];

		if (random) {
			choices = shuffle(choices);
		}

		model.setSolution(choices[position]);
		view.clearQuestion();
		view.appendQuestion(choices[position]);

		for (var i = 0; i < length; i++) {
			view.appendChoice(choices[i]);
		}

		view.attachRadioButtonEventHandlers();
		view.clearMessage();
		view.disableProceedButton();
		model.incrementTotalQuestions();
	}

	function radioAnswerSelected(value) {
		if (model.isCorrect(value)) {
			model.stopTimer();
			model.recordResults();
			view.showSuccess(model.getResponseTime(),
					model.getNumberOfClicks(), model.getNumberOfErrors());
			view.disableRadioButtons();
			view.showProgress(model.getProgress());
			if (model.getProgress() < 100) {
				view.enableProceedButton();
			} else {
				view.enableResultsButton();
			}
		} else {
			view.showError();
			model.incrementNumberOfErrors();
		}
	}

	function proceedClick() {
		model.next();
	}

	function mouseDown() {
		if (!model.isDone()) {
			view.clearMessage();
			model.incrementNumberOfClicks();
		}
	}
}