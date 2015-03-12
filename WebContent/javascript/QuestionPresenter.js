/**
 * 
 */
function QuestionPresenter(view) {
	QuestionPresenter.prototype.setupQuestionnaire = setupQuestionnaire;
	QuestionPresenter.prototype.radioAnswerSelected = radioAnswerSelected;
	QuestionPresenter.prototype.proceedClick = proceedClick;
	QuestionPresenter.prototype.mouseDown = mouseDown;

	var _view = view;
	this.window = _view.window;
	var _model = new QuestionModel(this);

	function setupQuestionnaire(scramble, length, position) {
		var choices = [ "anchor", "button", "camping", "dancer", "feather",
				"igloo", "kangaroo", "lion", "maple", "north", "panda",
				"study", "television", "umbrella", "victory", "watermelon",
				"yankee", "zebra" ];

		if (scramble) {
			choices = shuffle(choices);
		}

		_model.setSolution(choices[position]);
		_view.clearQuestion();
		_view.appendQuestion(choices[position]);

		for (var i = 0; i < length; i++) {
			_view.appendChoice(choices[i]);
		}

		_view.attachRadioButtonEventHandlers();
		_view.clearMessage();
		_view.disableProceedButton();
		_model.totalQuestions++;
	}

	function radioAnswerSelected(value) {
		if (_model.isCorrect(value)) {
			_model.stopTimer();
			_model.recordResults();
			_view.showSuccess(_model.responseTime, _model.numberOfClicks,
					_model.numberOfErrors);
			_view.disableRadioButtons();			
			_view.showProgress(_model.getProgress());
			if (_model.getProgress() < 100) {
				_view.enableProceedButton();
			} else {
				_view.enableResultsButton();
			}
		} else {
			_view.showError();
			_model.numberOfErrors++;
		}
	}

	function proceedClick() {
		_model.next();
	}

	function mouseDown() {
		if (!_model.done) {
			_view.clearMessage();
			_model.numberOfClicks++;
		}
	}
}