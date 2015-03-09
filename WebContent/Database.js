/**
 * 
 */

function Database() {
	var instance = null;
	var req = null;
	var asyncCallback = null;
	Database.prototype.connect = connect;
	Database.prototype.connectWithCallback = connectWithCallback;
	Database.prototype.selectParticipantById = selectParticipantById;
	Database.prototype.updateParticipant = updateParticipant;
	Database.prototype.getSession = getSession;
	Database.prototype.updateSessionWithCallback = updateSessionWithCallback;
	Database.prototype.clearSessionWithCallback = clearSessionWithCallback;

	function selectParticipantById(id) {
		var transaction = instance.transaction([ "participants" ], "readonly");
		var store = transaction.objectStore("participants");
		var index = store.index("id");

		return index.get(id);
	}

	function updateParticipant(customer, callback) {
		var transaction = instance.transaction([ "participants" ], "readwrite");
		var store = transaction.objectStore("participants");
		var index = store.index("id");
		var getRequest = index.get(customer.clientId);

		getRequest.onsuccess = function(e) {
			var custData = getRequest.result;
			custData.PIN = customer.PIN;
			custData.checkingBalance = customer.checkingBalance;
			custData.givenName = customer.givenName;
			custData.savingsBalance = customer.savingsBalance;
			custData.creditCard = customer.creditCard;
			custData.surname = customer.surname;

			var putRequest = store.put(custData, custData.clientId);
			if (callback) {
				putRequest.onsuccess = function(e) {
					callback(e);
				};
			}

			putRequest.onerror = function(e) {
				console.log('Error adding: ' + e);
			};

		};
	}

	function getSession(callback) {
		var transaction = instance.transaction([ "session" ], "readonly");
		var store = transaction.objectStore("session");
		var request = store.openCursor();
		request.onsuccess = callback;
	}

	function updateSessionWithCallback(customer, callback) {
		var transaction = instance.transaction([ "session" ], "readwrite");
		var store = transaction.objectStore("session");
		var request = store.add(customer, customer.clientId);

		if (callback) {
			transaction.oncomplete = callback;
		}

	}

	function clearSessionWithCallback(callback) {
		var transaction = instance.transaction([ "session" ], "readwrite");
		var store = transaction.objectStore("session");
		var request = store.clear()

		if (callback) {
			request.onsuccess = callback;
		}

	}

	function connectWithCallback(window, callback) {
		asyncCallback = callback;
		connect(window);
	}

	function connect(window) {
		if (!indexedDBOk(window))
			return;

		req = indexedDB.open("cosc.3P94.project", 1);
		req.onupgradeneeded = onupgradeneeded;
		req.onsuccess = onsuccess;
		req.onerror = onerror;
	}

	function indexedDBOk(window) {
		if (window.indexedDB) {

		} else if (window.mozIndexedDB) {
			window.indexedDB = window.mozIndexedDB;
		} else if (window.msIndexedDB) {
			window.indexedDB = window.msIndexedDB;
		}

		return "indexedDB" in window;
	}

	function onupgradeneeded(e) {
		var db = e.target.result;

		if (!db.objectStoreNames.contains("participants")) {
			var os = db.createObjectStore("participants");
			os.createIndex("id", "id", {
				unique : true
			});

			initialize(os);
		}

		if (!db.objectStoreNames.contains("session")) {
			var os = db.createObjectStore("session");
			os.createIndex("id", "id", {
				unique : true
			});
		}
	}

	function initialize(os) {
		// Define a person
		var steph = {
			clientId : "3322",
			PIN : "4321",
			surname : "McKay",
			givenName : "Steph",
			checkingBalance : "4999.00",
			savingsBalance : "132.00",
			creditCard : "200.00",
			created : new Date()
		}

		var adam = {
			clientId : "9988",
			PIN : "4523",
			surname : "Benner",
			givenName : "Adam",
			checkingBalance : "69.00",
			savingsBalance : "58008.00",
			creditCard : "2995.00",
			created : new Date()
		}

		// Perform the add
		var request = os.add(steph, steph.clientId);

		request.onerror = function(e) {
			console.log("Error", e.target.error.name);
			// some type of error handler
		}

		request.onsuccess = function(e) {
			console.log("Woot! Did it");
		}
	}

	function onsuccess(e) {
		console.log("running onsuccess");
		instance = e.target.result;
		if (asyncCallback) {
			asyncCallback();
		}
	}

	function onerror(e) {
	}
}