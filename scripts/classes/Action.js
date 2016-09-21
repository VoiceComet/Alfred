/**
 * An Action is a state switch. You can define an act method which is called when one of you commands is called
 * @param {String} name - name of action
 * @param {number} parameterCount - count of parameters
 * @param {State} followingState - state after action run
 * @constructor
 */
function Action (name, parameterCount, followingState) {
	/** @type {String} */
	this.name = name;
	/** @type {[Command]} */
	this.commands = [];
	/** @type {State} */
    this.followingState = followingState;
	/** @type {number} */
    this.parameterCount = parameterCount;

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
	 * add a list of commands to this action
	 * @param {[Command]} commands - list of commands
	 */
	this.addCommands = function(commands) {
		for (var i = 0; i < commands.length; i++) {
			this.addCommand(commands[i]);
		}
    };

	/**
	 * act method which has to override if something should happen
	 * @param {[String]} arguments
	 */
	this.act = function(arguments) {};
}