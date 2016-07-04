/**
 * parameterCount: int, count of parameters
 * followingState: State object, state after action run
*/
function Action (parameterCount, followingState) {
    this.commands = [];
    this.followingState = followingState;
    this.parameterCount = parameterCount;
	
    this.addCommand = function(command) {
		if (this.parameterCount == command.parameterCount) {
			this.commands.push(command);
		} else {
			//error message
			alert("parameterCount not the same");
		}
    };
	
	this.addCommands = function(commands) {
		for (var i = 0; i < commands.length; i++) {
			this.addCommand(commands[i]);
		}
    };
	
	//has to override
	this.act = function(arguments) {};
}