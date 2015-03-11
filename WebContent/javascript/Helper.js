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