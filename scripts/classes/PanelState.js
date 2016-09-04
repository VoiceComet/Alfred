/**
 * State with standard panel actions
 * @extends State
 * @param name
 * @constructor
 */
function PanelState(name) {
	// Call the parent constructor
	State.call(this, name);

	//standard actions
	this.scrollable = true;
	this.scrollDownAction = null;
	this.scrollUpAction = null;

	var oldGenerateStandardActions = this.generateStandardActions;
	this.generateStandardActions = function() {
		oldGenerateStandardActions.apply(this);

		this.scrollDownAction = new Action("Scroll down action", 0, this);
		this.scrollDownAction.addCommand(new Command("scroll down", 0));
		this.scrollDownAction.act = function() {
			callContentScriptMethod("elementScrollDown", {"id":"ChromeSpeechControlPanel"});
		};

		this.scrollUpAction = new Action("Scroll up action", 0, this);
		this.scrollUpAction.addCommand(new Command("scroll up", 0));
		this.scrollUpAction.act = function() {
			callContentScriptMethod("elementScrollUp", {"id":"ChromeSpeechControlPanel"});
		};
	};

	var oldActivateStandardActions = this.activateStandardActions;
	this.activateStandardActions = function() {
		oldActivateStandardActions.apply(this);

		if (this.scrollable) {
			this.addAction(this.scrollDownAction);
			this.addAction(this.scrollUpAction);
		}
	}
}