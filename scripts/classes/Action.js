/**
 * An Action is a state switch. You can define an act method which is called when one of you commands is called
 * @param {String} internalName - internalName of action
 * @param {number} parameterCount - count of parameters
 * @param {State} followingState - state after action run
 * @constructor
 */
function Action (internalName, parameterCount, followingState) {
	/** @type {String} */
	this.internalName = internalName;
	/** @type {State} */
    this.followingState = followingState;
	/** @type {number} */
    this.parameterCount = parameterCount;
	/** @type {Module} */
	this.module = null;

	/**
	 * get translated name of state
	 * @return {String} name
	 */
	this.getName = function() {
		return getActionTranslation(this.internalName)
	};

	/**
	 * get list of translated commands
	 * @return {[Command]} command list
	 */
	this.getCommands = function() {
		var action = getActionTranslationObject(this.internalName);
		if (action != null) {
			var commands = [];
			for (var i = 0; i < action["commands"].length; i++) {
				commands.push(new Command(action["commands"][i], this.parameterCount));
			}
			return commands;
		}
		return [];
	};

	/**
	 * act method which has to override if something should happen
	 * @param {[String]} arguments
	 */
	this.act = function(arguments) {};
}