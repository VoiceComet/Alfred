/**
 * expression: str, regular expression
 * parameterCount: int, count of parameters
*/
function Command (expression, parameterCount) {
	this.expression = new RegExp(expression, 'i');
    this.parameterCount = parameterCount;
}