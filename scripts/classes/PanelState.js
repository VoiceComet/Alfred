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
	this.enlargeable = false;
	this.enlargeAction = null;
	this.reduceAction = null;

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

		this.enlargeAction = new Action("Enlarge panel action", 0, this);
		this.enlargeAction.addCommands([
			new Command("enlarge", 0),
			new Command("bigger", 0),
			new Command("larger", 0)
		]);
		this.enlargeAction.act = function() {
			callContentScriptMethod("enlargePanel", {});
		};

		this.reduceAction = new Action("Reduce panel action", 0, this);
		this.reduceAction.addCommands([
			new Command("reduce", 0),
			new Command("smaller", 0)
		]);
		this.reduceAction.act = function() {
			callContentScriptMethod("reducePanel", {});
		};
	};

	var oldActivateStandardActions = this.activateStandardActions;
	this.activateStandardActions = function() {
		oldActivateStandardActions.apply(this);

		if (this.scrollable) {
			this.addAction(this.scrollDownAction);
			this.addAction(this.scrollUpAction);
		}
		if (this.enlargeable) {
			this.addAction(this.enlargeAction);
			this.addAction(this.reduceAction);
		}
	}
}