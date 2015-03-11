/**
 * 
 */
function StartPresenter(view) {
	StartPresenter.prototype.startClicked = startClicked;
	StartPresenter.prototype.continueClicked = continueClicked;
	StartPresenter.prototype.getView = getView;
	StartPresenter.prototype.alert = alert;
	StartPresenter.prototype.gotoQuestions = gotoQuestions;
	
	var _view = view;
	var _model = new StartModel(this);
	
	function startClicked(email) {
		_model.startNewTest(email);
	}
	
	function continueClicked(email) {
		_model.continueTest(email);
	}
	
	function getView() {
		return _view;
	}
	
	function alert(message){
		_view.alert(message);
	}
	
	function gotoQuestions() {
		_view.gotoQuestions();
	}
}