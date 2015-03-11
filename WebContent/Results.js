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

					var results = "id,Order,Number Of Items,Position,Trial #1,Trial #2,Trial #3 <br />";
					for (var i = 0; i < p.results.length; i++) {
						results += p.id + "," + "Random," + p.results[i].length + ","
								+ (p.results[i].position + 1) + ","
								+ p.results[i].trial1 + ","
								+ p.results[i].trial2 + ","
								+ p.results[i].trial3 + "<br />";
					}
					$("results").innerHTML = results;
				}

			});

}