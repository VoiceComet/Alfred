/**
 * init: function(){}
*/
function Module (name, init) {
	this.name = name;
    this.actions = [];
	
    this.addAction = function(action) {
		this.actions.push(action);
    };
	
	this.addActions = function(actions) {
		for (var i = 0; i < actions.length; i++) {
			this.addAction(actions[i]);
		}
    };
	
	this.init = init;
}