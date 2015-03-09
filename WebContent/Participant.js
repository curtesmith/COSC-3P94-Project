/**
 * 
 */

function Participant(db) {
	var DAL = db;
	this.PIN = null;
	this.checkingBalance = null;
	this.clientId = null;
	this.created = null;
	this.givenName = null;
	this.savingsBalance = null;
	this.creditCard = null;
	this.surname = null;

	Participant.prototype.getById = getById;
	Participant.prototype.fill = fill;
	Participant.prototype.update = update;

	function getById(id, callback) {
		if (id === "" || isNaN(id))
			return;

		var request = DAL.selectParticipantById(id);
		request.onsuccess = callback;
	}

	function fill(data) {
		this.PIN = data["PIN"];
		this.checkingBalance = data["checkingBalance"];
		this.clientId = data["clientId"];
		this.created = data["created"];
		this.givenName = data["givenName"];
		this.savingsBalance = data["savingsBalance"];
		this.creditCard = data["creditCard"];
		this.surname = data["surname"];
	}
	
	function update(callback){
		DAL.updateParticipant(this, callback);
	}
};