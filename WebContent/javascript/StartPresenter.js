/**
 * 
 */
function StartPresenter(iView) {
	StartPresenter.prototype.startClicked = startClicked;
	StartPresenter.prototype.continueClicked = continueClicked;
	StartPresenter.prototype.alert = alert;
	StartPresenter.prototype.gotoQuestions = gotoQuestions;
	
	var view = iView;
	this.window = view.window;
	var model = new StartModel(this);
	
	function startClicked(email) {
		model.startNewTest(email);
	}
	
	function continueClicked(email) {
		model.continueTest(email);
	}
	
	function getView() {
		return view;
	}
	
	function alert(message){
		view.alert(message);
	}
	
	function gotoQuestions() {
		view.gotoQuestions();
	}
}