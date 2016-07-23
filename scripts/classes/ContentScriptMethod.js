/**
 * A ContentScriptMethod can be called from the content script of the front page
 * @param {String} name - call name of the method
 * @param {function(Object)} method - function which is called on the front page. example: function(params) {...}
 * @constructor
 */
function ContentScriptMethod (name, method) {
	/** @type {String} */
	this.name = name;
	/** @type {function(Object)} */
	this.method = method;
}
