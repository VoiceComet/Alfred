/**
 * A Command has a regular expression, which is unique and explicit
 * @param {String} expression - regular expression in string format
 * @param {Number} parameterCount - count of parameters in regular expression (example "(.+)")
 * @constructor
 */
function Command (expression, parameterCount) {
	/**
	 * regular expression as string
	 * @type {String}
	 * @protected
	 */
	this.expression = expression;

	/**
	 * regular expression as RegExp Object
	 * @type {RegExp}
	 * @private
	 */
	this.regExpression = new RegExp(this.expression, 'i');

	/**
	 * count of parameters in regular expression (example "(.+)")
	 * @type {Number}
	 */
    this.parameterCount = parameterCount;

	/**
	 * get regular expression as RegExp Object
	 * @return {RegExp}
	 */
	this.getRegExp = function() {
		//noinspection JSPotentiallyInvalidUsageOfThis
		return this.regExpression;
	}
}