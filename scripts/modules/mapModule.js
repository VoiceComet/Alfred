
addModule(new Module("mapModule", function () {

	var mapState = new PanelState("mapState");
	mapState.scrollable = false;
	mapState.enlargeable = true;
	mapState.init = function() {
		this.cancelAction.cancelAct = function() {
			callContentScriptMethod("closeMap", {});
			callContentScriptMethod("hidePanel", {});
		};

		this.enlargeAction.oldAct = this.enlargeAction.act;
		this.enlargeAction.act = function() {
			this.oldAct();
			callContentScriptMethod("resizeMap", {});
		};

		this.reduceAction.oldAct = this.reduceAction.act;
		this.reduceAction.act = function() {
			this.oldAct();
			callContentScriptMethod("resizeMap", {});
		};

		/**
		 * Search
		 * @type {Action}
		 */
		var mapSearch = new Action("mapSearch", 1, this);
		mapSearch.act = function (arguments) {
			callContentScriptMethod("mapSearch", {query:arguments[0]});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapSearch);

		/**
		 * multilingual search
		 * @type {MultilingualAction}
		 */
		var mapLanguageSearch = new MultilingualAction("mapLanguageSearch", mapSearch, [{notify:"sayQueryInChosenLanguage", say:"sayQueryInChosenLanguage"}]);
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapLanguageSearch);

		/**
		 * search route
		 * @type {Action}
		 */
		var mapSearchRoute = new Action("mapSearchRoute", 2, this);
		mapSearchRoute.act = function (arguments) {
			callContentScriptMethod("mapSearchRoute", {origin:arguments[0], destination:arguments[1]});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapSearchRoute);

		/**
		 * multilingual search route
		 * @type {MultilingualAction}
		 */
		var mapLanguageSearchRoute = new MultilingualAction("mapLanguageSearchRoute", mapSearchRoute, [
			{notify:"sayOriginInChosenLanguage", say:"sayOriginInChosenLanguage"},
			{notify:"sayDestinationInChosenLanguage", say:"sayDestinationInChosenLanguage"}
		]);
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapLanguageSearchRoute);

		/**
		 * Zoom to marker
		 * @type {Action}
		 */
		var mapZoomToMarker = new Action("mapZoomToMarker", 1, this);
		mapZoomToMarker.act = function (arguments) {
			callContentScriptMethod("mapZoomToMarker", {marker:arguments[0]});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapZoomToMarker);

		/**
		 * center marker
		 * @type {Action}
		 */
		var mapCenterMarker = new Action("mapCenterMarker", 1, this);
		mapCenterMarker.act = function (arguments) {
			callContentScriptMethod("mapCenterMarker", {marker:arguments[0]});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapCenterMarker);

		/**
		 * Zoom in
		 * @type {Action}
		 */
		var mapZoomIn = new Action("mapZoomIn", 0, this);
		mapZoomIn.act = function () {
			callContentScriptMethod("mapZoomIn", {});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapZoomIn);

		/**
		 * Zoom out
		 * @type {Action}
		 */
		var mapZoomOut = new Action("mapZoomOut", 0, this);
		mapZoomOut.act = function () {
			callContentScriptMethod("mapZoomOut", {});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapZoomOut);

		/**
		 * scroll up
		 * @type {Action}
		 */
		var mapScrollUp = new Action("mapScrollUp", 0, this);
		mapScrollUp.act = function () {
			callContentScriptMethod("mapScrollUp", {});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapScrollUp);

		/**
		 * scroll down
		 * @type {Action}
		 */
		var mapScrollDown = new Action("mapScrollDown", 0, this);
		mapScrollDown.act = function () {
			callContentScriptMethod("mapScrollDown", {});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapScrollDown);

		/**
		 * scroll left
		 * @type {Action}
		 */
		var mapScrollLeft = new Action("mapScrollLeft", 0, this);
		mapScrollLeft.act = function () {
			callContentScriptMethod("mapScrollLeft", {});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapScrollLeft);

		/**
		 * scroll right
		 * @type {Action}
		 */
		var mapScrollRight = new Action("mapScrollRight", 0, this);
		mapScrollRight.act = function () {
			callContentScriptMethod("mapScrollRight", {});
		};
		//noinspection JSPotentiallyInvalidUsageOfThis
		this.addAction(mapScrollRight);
	};
	registerGlobalState(mapState);

	/**
	 * open map in panel
	 * @type {Action}
	 */
	var openMap = new Action("openMap", 0, mapState);
	openMap.act = function () {
		callContentScriptMethod("openMap", {});
	};
	this.addAction(openMap);

}));
