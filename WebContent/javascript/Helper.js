/**
 * 
 */
function g(id) {
	return document.getElementById(id);
}

function $(id) {
	return g(id);
}

function $name(name) {
	return document.getElementsByName(name);
}

function $create(tagName) {
	return document.createElement(tagName);
}

function $createText(text) {
	return document.createTextNode(text);
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}