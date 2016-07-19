/**
 * A Command has a regular expression, which is unique and explicit
 * @param {String} expression - regular expression in string format
 * @param {Number} parameterCount - count of parameters in regular expression (example "(.+)")
 * @constructor
 */
function Command (expression, parameterCount) {
	this.expression = new RegExp(expression, 'i');
    this.parameterCount = parameterCount;
}