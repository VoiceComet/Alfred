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

		this.scrollDownAction = new Action("scrollDown", 0, this);
		this.scrollDownAction.act = function() {
			callContentScriptMethod("elementScrollDown", {"id":"ChromeSpeechControlPanel"});
		};

		this.scrollUpAction = new Action("scrollUp", 0, this);
		this.scrollUpAction.act = function() {
			callContentScriptMethod("elementScrollUp", {"id":"ChromeSpeechControlPanel"});
		};

		this.enlargeAction = new Action("enlargePanel", 0, this);
		this.enlargeAction.act = function() {
			callContentScriptMethod("enlargePanel", {});
		};

		this.reduceAction = new Action("reducePanel", 0, this);
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