
addModule(new Module("mapModule", function () {

	var mapState = new State("MapState");
	mapState.init = function() {
		notify("entered map state");
		this.cancelAction.act = function() {
			callContentScriptMethod("closeMap", {});
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
	 * Search
	 * @type {Action}
	 */
	var mapSearch = new Action("mapSearch", 1, mapState);
	mapSearch.addCommand(new Command("go to (.+)", 1));
	mapSearch.addCommand(new Command("search (.+)", 1));
	mapSearch.act = function (arguments) {
		callContentScriptMethod("mapSearch", {query:arguments[0]});
	};
	mapState.addAction(mapSearch);

	/**
	 * multilingual search
	 * @type {MultilingualAction}
	 */
	var mapLanguageSearch = new MultilingualAction("mapLanguageSearch", mapSearch, [{notify:"Say your search query in chosen language", say:"Say your search query in chosen language"}]);
	mapLanguageSearch.addCommand(new Command("language search", 0));
	mapState.addAction(mapLanguageSearch);

	/**
	 * search route
	 * @type {Action}
	 */
	var mapSearchRoute = new Action("mapSearchRoute", 2, mapState);
	mapSearchRoute.addCommand(new Command("from (.+) to (.+)", 2));
	mapSearchRoute.act = function (arguments) {
		callContentScriptMethod("mapSearchRoute", {origin:arguments[0], destination:arguments[1]});
	};
	mapState.addAction(mapSearchRoute);

	/**
	 * Zoom to marker
	 * @type {Action}
	 */
	var mapZoomToMarker = new Action("mapZoomToMarker", 1, mapState);
	mapZoomToMarker.addCommand(new Command("zoom to (.)$", 1));
	mapZoomToMarker.act = function (arguments) {
		callContentScriptMethod("mapZoomToMarker", {marker:arguments[0]});
	};
	mapState.addAction(mapZoomToMarker);

	/**
	 * center marker
	 * @type {Action}
	 */
	var mapCenterMarker = new Action("mapCenterMarker", 1, mapState);
	mapCenterMarker.addCommand(new Command("^(.)$", 1));
	mapCenterMarker.addCommand(new Command("center (.)$", 1));
	mapCenterMarker.addCommand(new Command("centre (.)$", 1));
	mapCenterMarker.act = function (arguments) {
		callContentScriptMethod("mapCenterMarker", {marker:arguments[0]});
	};
	mapState.addAction(mapCenterMarker);

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
