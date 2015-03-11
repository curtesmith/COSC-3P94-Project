/**
 * 
 */
document.addEventListener("DOMContentLoaded", setup, false);

var database = null;
var session = null;

function setup() {
	database = new Database(window);
	database.connectWithCallback(window, function(e) {
		showResults();
	});
}

function showResults() {
	var p = null;
	var s = new Session(database);

	s.get(function(e) {
		if (e.target.result) {
			p = new Participant(database);
			p.fill(e.target.result.value);
			renderResults(p);
		}

	});

}

function renderResults(participant) {
	var results = "id,Order,Number Of Items,Position,Trial #1,Trial #2,Trial #3 <br />";

	for (var i = 0; i < participant.results.length; i++) {
		results += participant.id + "," + "Random,"
				+ participant.results[i].length + ","
				+ (participant.results[i].position + 1) + ","
				+ participant.results[i].trial1 + ","
				+ participant.results[i].trial2 + ","
				+ participant.results[i].trial3 + "<br />";
	}

	$("results").innerHTML = results;
}