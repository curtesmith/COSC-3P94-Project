/**
 * 
 */
function Session(db) {
	var DAL = db;

	Session.prototype.update = update;
	Session.prototype.clear = clear;
	Session.prototype.get = get;

	function update(participant, callback) {
		clear(function(e) {
			DAL.updateSessionWithCallback(participant, callback);
		});
	}

	function clear(callback) {
		DAL.clearSessionWithCallback(callback);
	}

	function get(callback) {
		DAL.getSession(callback);
	}
}