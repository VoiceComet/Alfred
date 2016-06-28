/** Create Module **/
addModule(new Module("Test", function() {
	/** START Create Init Actions **/

	//-----Action 1 Start---------
	//create an action with followed module state (globalCommonState is the global common state)
	var action1 = new Action(0, globalCommonState);
	
	//create a command list
	var commands = [
		new Command("hello", 0)
		//... more commands
	];
	//add command list to action
	action1.addCommands(commands);
	
	//set act function
	action1.act = function (arguments) {
		//add functionality
		alert("action1: success!");
	};

	
	//add action to modules action list
	this.addAction(action1);
	//-----Action 1 End-----------
	
	//-----Action 2 Start---------
	var action2 = new Action(1, globalCommonState);
	var commands = [
		new Command("hello\\s(.+)", 1),
		new Command("hey\\s(.+)", 1)
	];
	action2.addCommands(commands);
	action2.act = function (arguments) {
		alert("action2: success!, parameter: " + arguments[0]);
	};
	this.addAction(action2);
	//-----Action 2 End-----------
	//... more actions

	/** END Create Init Actions **/

	
	/** START maybe create States **/
	var state1 = new State("TestState");
	state1.init = function () {
		//some state script (for example: draw lines, show a choose, open a panel,...)
		alert('say "exit" or "go away"');
	};
	
	//action from globalCommonState to state1
	var action3 = new Action(0, state1);
	var commands = [
		new Command("change state", 0)
	];
	action3.addCommands(commands);
	action3.act = function (arguments) {
		alert("action3: state 1 is active!");
	};
	this.addAction(action3); //<-- from globalCommonState use "this"
	
	//action from state1 to globalCommonState
	var action4 = new Action(0, globalCommonState);
	var commands = [
		new Command("exit", 0),
		new Command("go away", 0)
	];
	action4.addCommands(commands);
	action4.act = function (arguments) {
		alert("action4: globalCommonState is active!");
	};
	state1.addAction(action4); //<--- use "state1" instead of "this"!!
	//...
	/** END maybe create States **/
}));


