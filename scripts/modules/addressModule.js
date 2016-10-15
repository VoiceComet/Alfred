/**
 * Module for interacting with addresses on web pages
 */

addModule(new Module("addressModule", function () {

	/**
	 * State for searching an expression
	 */
	var addressState = new State("addressState");
	addressState.init = function () {
		this.cancelAction.act = function() {
			callContentScriptMethod("cancelAddressState", {});
		};
	};

	/**
	 * search for addresses
	 * @type {Action}
	 */
	var addressSearch = new Action("find addresses", 0, addressState);
	addressSearch.addCommands([
		new Command("addresses", 0)
	]);
	addressSearch.act = function () {
		callContentScriptMethod("showAddressResults", {}, function (params) {
			if (typeof params !== 'undefined') {
				if (params.hasOwnProperty("content")) {
					say(params.content);
				}
				if (params.hasOwnProperty("followingState")) {
					if (params.followingState == "globalCommonState") {
						if (recognizing) activeState.stopSpeechRecognition();
						changeActiveState(globalCommonState);
					}
				}
			}
		});
	};
	this.addAction(addressSearch);

	/**
	 * next address
	 * @type {Action}
	 */
	var next = new Action("nextAddress", 0, addressState);
	next.addCommand(new Command("next", 0));
	next.act = function() {
		callContentScriptMethod("nextAddress", {});
	};
	addressState.addAction(next);

	/**
	 * previous address
	 * @type {Action}
	 */
	var prev = new Action("previousAddress", 0, addressState);
	prev.addCommand(new Command("previous", 0));
	prev.act = function () {
		callContentScriptMethod("previousAddress", {});
	};
	addressState.addAction(prev);

	/**
	 * go to certain address
	 * @type {Action}
	 */
	var certainAddress = new Action("certainAddress", 1, addressState);
	certainAddress.addCommand(new Command("go to address ([\\d]+)", 1));
	certainAddress.act = function () {
		callContentScriptMethod("certainAddress", arguments[0], function (params) {
			if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
	};
	addressState.addAction(certainAddress);

	/**
	 * show address on map
	 * @type {Action}
	 */
	var showAddressOnMap = new Action("showAddressOnMap", 0, null);
	showAddressOnMap.addCommand(new Command("show on map", 0));
	showAddressOnMap.addCommand(new Command("show address on map", 0));
	showAddressOnMap.act = function () {
		this.followingState = getGlobalState("MapState");
		if (this.followingState == null) {
			this.followingState = globalCommonState;
			console.log("following map state not found");
		} else {
			callContentScriptMethod("showAddressOnMap", {});
		}
	};
	addressState.addAction(showAddressOnMap);

}));