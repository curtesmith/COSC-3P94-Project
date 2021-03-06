/**
 * 
 */

function StartModel(iPresenter) {
	StartModel.prototype.startNewTest = startNewTest;
	StartModel.prototype.continueTest = continueTest;
	StartModel.prototype.gotoQuestions = gotoQuestions;

	var presenter = iPresenter;
	database = new Database();
	database.connect(presenter.window);
	session = new Session(database);

	function startNewTest(email) {
		var participant = new Participant(database);
		participant.id = email
		participant.result = null;
		participant.add(function(e) {
			session.update(participant, function(e) {
				gotoQuestions(participant);
			});
		});
	}

	function continueTest(email) {
		var participant = new Participant(database);
		participant.getById(email, function(e) {
			if (e.target.result) {
				gotoQuestions(e.target.result);
			} else {
				presenter.alert("no match on email");
			}
		});
	}

	function gotoQuestions(participant) {
		session.update(participant, function(e) {
			presenter.gotoQuestions();
		});

	}
}