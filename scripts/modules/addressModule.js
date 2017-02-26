/**
 * Module for interacting with addresses on web pages
 */

addModule(new Module("addressModule", function () {

	/**
	 * State for searching an expression
	 */
	var addressState = new State("addressState");
	addressState.init = function () {
		this.cancelAction.cancelAct = function() {
			callContentScriptMethod("cancelAddressState", {});
		};
	};

	/**
	 * search for addresses
	 * @type {Action}
	 */
	var addressSearch = new Action("showAddresses", 0, addressState);
	addressSearch.act = function () {
		callContentScriptMethod("showAddressResults", {}, function (params) {
			if (typeof params !== 'undefined') {
				if (params.hasOwnProperty("content")) {
					say(params.content);
				}
				if (params.hasOwnProperty("followingState")) {
					if (params.followingState == "globalCommonState") {
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
	var next = new Action("next", 0, addressState);
	next.act = function() {
		callContentScriptMethod("nextAddress", {});
	};
	addressState.addAction(next);

	/**
	 * previous address
	 * @type {Action}
	 */
	var prev = new Action("previous", 0, addressState);
	prev.act = function () {
		callContentScriptMethod("previousAddress", {});
	};
	addressState.addAction(prev);

	/**
	 * go to certain address
	 * @type {Action}
	 */
	var certainAddress = new Action("certainAddress", 1, addressState);
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
	showAddressOnMap.act = function () {
		var mapState = getGlobalState("MapState");
		if (mapState == null) {
			this.followingState = globalCommonState;
			console.error("showAddressOnMap: following map state not found");
		} else {
			callContentScriptMethod("showAddressOnMap", {});

			//clone map state for avoid additional actions in original map state
			mapState = jQuery.extend(true, {}, mapState);
			//reset cloned state
			mapState.actions = [];
			mapState.initialized = false;
			//extend init method
			mapState.oldInit = mapState.init;
			mapState.init = function () {
				//this.oldState = addressState;
				this.oldInit();

				//add next actions to mapState
				//noinspection JSCheckFunctionSignatures
				var nextMapAction = new Action("next", 0, this);
				nextMapAction.act = function () {
					callContentScriptMethod("nextAddress", {}, function(params) {
						callContentScriptMethod("mapSearch", {query:params.address});
					});
				};
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.addAction(nextMapAction);

				//add previous actions to mapState
				//noinspection JSCheckFunctionSignatures
				var previousMapAction = new Action("previous", 0, this);
				previousMapAction.act = function () {
					callContentScriptMethod("previousAddress", {}, function(params) {
						callContentScriptMethod("mapSearch", {query:params.address});
					});
				};
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.addAction(previousMapAction);
			};

			this.followingState = mapState;
		}
	};
	addressState.addAction(showAddressOnMap);
}));