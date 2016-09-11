
addModule(new Module("mapModule", function () {

	var mapState = new State("MapState");
	mapState.init = function() {
		notify("entered map state");
		this.cancelAction.act = function() {
			callContentScriptMethod("hidePanel", {});
			notify("canceled map state");
		};
	};

	/**
	 * open map in panel
	 * @type {Action}
	 */
	var openMap = new Action("openMap", 0, mapState);
	openMap.addCommand(new Command("show map", 0));
	openMap.act = function () {
		callContentScriptMethod("openMap", {});
	};
	this.addAction(openMap);

	/**
	 * Zoom in
	 * @type {Action}
	 */
	var mapZoomIn = new Action("mapZoomIn", 0, mapState);
	mapZoomIn.addCommand(new Command("zoom in", 0));
	mapZoomIn.act = function () {
		callContentScriptMethod("mapZoomIn", {});
	};
	mapState.addAction(mapZoomIn);

	/**
	 * Zoom out
	 * @type {Action}
	 */
	var mapZoomOut = new Action("mapZoomOut", 0, mapState);
	mapZoomOut.addCommand(new Command("zoom out", 0));
	mapZoomOut.act = function () {
		callContentScriptMethod("mapZoomOut", {});
	};
	mapState.addAction(mapZoomOut);

	/**
	 * scroll up
	 * @type {Action}
	 */
	var mapScrollUp = new Action("mapScrollUp", 0, mapState);
	mapScrollUp.addCommand(new Command("scroll up", 0));
	mapScrollUp.act = function () {
		callContentScriptMethod("mapScrollUp", {});
	};
	mapState.addAction(mapScrollUp);

	/**
	 * scroll down
	 * @type {Action}
	 */
	var mapScrollDown = new Action("mapScrollDown", 0, mapState);
	mapScrollDown.addCommand(new Command("scroll down", 0));
	mapScrollDown.act = function () {
		callContentScriptMethod("mapScrollDown", {});
	};
	mapState.addAction(mapScrollDown);

	/**
	 * scroll left
	 * @type {Action}
	 */
	var mapScrollLeft = new Action("mapScrollLeft", 0, mapState);
	mapScrollLeft.addCommand(new Command("scroll left", 0));
	mapScrollLeft.act = function () {
		callContentScriptMethod("mapScrollLeft", {});
	};
	mapState.addAction(mapScrollLeft);

	/**
	 * scroll right
	 * @type {Action}
	 */
	var mapScrollRight = new Action("mapScrollRight", 0, mapState);
	mapScrollRight.addCommand(new Command("scroll right", 0));
	mapScrollRight.act = function () {
		callContentScriptMethod("mapScrollRight", {});
	};
	mapState.addAction(mapScrollRight);
}));
