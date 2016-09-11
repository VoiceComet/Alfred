
addModule(new Module("mapModule", function () {

	var mapState = new State("MapState");
	mapState.init = function() {
		notify("entered map state");
		this.cancelAction.act = function() {
			callContentScriptMethod("hidePanel", {});
			notify("canceled map state");
		};
	};

	var openMap = new Action("openMap", 0, mapState);
	openMap.addCommand(new Command("show map", 0));
	openMap.act = function () {
		callContentScriptMethod("openMap", {});
	};
	this.addAction(openMap);

}));
