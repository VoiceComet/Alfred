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
	/** @type {[Command]} */
    /** @private */
	this.commands = [];
	/** @type {State} */
    this.followingState = followingState;
	/** @type {number} */
    this.parameterCount = parameterCount;
	/** @type {Module} */
	this.module = null;
	this.loadLanguageCommands = true;

	/**
	 * get translated name of state
	 * @return {String} name
	 */
	this.getName = function() {
		return getActionTranslation(this.internalName)
	};

    /**
     * add a command to this action
     * @param {Command} command - command
     */
    this.addCommand = function(command) {
        if (this.parameterCount == command.parameterCount) {
            this.commands.push(command);
        } else {
            //error message
            alert("parameterCount not the same");
        }
    };

	/**
	 * get list of translated commands
	 * @return {[Command]} command list
	 */
	this.getCommands = function() {
        var commands = this.commands.slice();
        if (this.loadLanguageCommands) {
			var action = getActionTranslationObject(this.internalName);
			if (action != null) {
				for (var i = 0; i < action["commands"].length; i++) {
					commands.push(new Command(action["commands"][i], this.parameterCount));
				}
			}
		}
		return commands;
	};

	/**
	 * act method which has to override if something should happen
	 * @param {[String]} arguments
	 */
	this.act = function(arguments) {};
}