/**
 * 
 */

function Participant(db) {
	var DAL = db;
	this.id = null;
	this.results = null;

	Participant.prototype.getById = getById;
	Participant.prototype.fill = fill;
	Participant.prototype.update = update;
	Participant.prototype.add = add;

	function getById(id, callback) {
		if (id === "")
			return;

		var request = DAL.selectParticipantById(id);
		request.onsuccess = callback;
	}

	function fill(data) {
		this.id = data.id;
		this.results = data.results;
	}
	
	function add(callback){
		DAL.addParticipant(this, callback);
	}
	
	function update(callback){
		DAL.updateParticipant(this, callback);
	}
};