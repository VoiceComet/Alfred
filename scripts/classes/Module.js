/**
 * Module
 * @param {String} name - name of method
 * @param {function()} init - initialize function which is called when the Module is loaded
 * @constructor
 */
function Module (name, init) {
	/** @type {String} */
	this.name = name;
	/** @type {Action[]} */
	this.actions = [];

	/** @type {function()} */
	this.init = init;

	/**
	 * add an action to this module, the action list will be loaded in the global common state
	 * @param {Action} action - action
	 */
    this.addAction = function(action) {
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