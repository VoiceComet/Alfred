/**
 * Module
 * @param {String} settingName - setting name of Module
 * @param {function()} init - initialize function which is called when the Module is loaded
 * @constructor
 */
function Module (settingName, init) {
	/** @type {String} */
	this.settingName = settingName;
	/** @type {Boolean} */
	this.active = true;
	/** @type {Action[]} */
	this.actions = [];

	/** @type {function()} */
	this.init = init;

	//get "is module active"
	var that = this;
	var stdValue = {};
	stdValue[this.settingName] = this.active;
	chrome.storage.sync.get(stdValue, function(value) {
		that.active = value[that.settingName];
	});

	/**
	 * add an action to this module, the action list will be loaded in the global common state
	 * @param {Action} action - action
	 */
    this.addAction = function(action) {
    	action.module = this;
		this.actions.push(action);
    };

	/**
	 * add a list of actions to this module, the action list will be loaded in the global common state
	 * @param {Action[]} actions
	 */
	this.addActions = function(actions) {
		for (var i = 0; i < actions.length; i++) {
			this.addAction(actions[i]);
		}
    };
}