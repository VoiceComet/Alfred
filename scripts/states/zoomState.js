/**
 * State for zooming the page
 */
var zoomState = new State("zoomState");
zoomState.init = function () {
    var index = modules.indexOf("zoomState");
    this.actions = [];
    //add actions of modules
    for (var i = 0; i < modules[index].actions.length; i++) {
        zoomState.addAction(modules[index].actions[i]);
    }
};