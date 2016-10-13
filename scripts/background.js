/**
 * global state where all modules are reachable
 * @global
 */
var globalCommonState = new State("GlobalCommonState");
globalCommonState.init = function () {
	this.ableToCancel = false;
	
	this.actions = [];
	//add actions of modules
	for (var i = 0; i < modules.length; i++) {
		for (var j = 0; j < modules[i].actions.length; j++) {
			this.addAction(modules[i].actions[j]);
		}
	}
};

/** @global */
var activeState;
/** @global */
var activeTab;
/** @global */
var modules = [];
/** @global */
var permissionGrounded = true;
/** @global */
var tabStates = [];
/** @global */
var recognizing = true;


//global butler name for better access
/** @global */
var butlerName = "Alfred";
//get butler name from storage
chrome.storage.sync.get({
	speechAssistantName: "Alfred"
}, function(items) {
	//noinspection JSUnresolvedVariable
	butlerName = items.speechAssistantName;
});
/**
 * function that is called after option changing
 * @param changes
 */
function optionChangeListener(changes) {
	for (var key in changes)  {
		if (changes.hasOwnProperty(key)) {
			if (key == "speechAssistantName") {
				//refresh butler name after option change
				butlerName = changes[key].newValue;
				return;
			} else if (key == "speechAssistantVoice") {
				//say something with new voice
				say("This is my new voice");
				return;
			}
			//refresh active modules
			for (var i = 0; i < modules.length; i++) {
				if (key == modules[i].settingName) {
					modules[i].active = changes[key].newValue;
					return;
				}
			}
		}
	}
}
chrome.storage.onChanged.addListener(optionChangeListener);


//get active tab
chrome.tabs.query({active:true, currentWindow:true}, function (tabs) {
	if (tabs.length > 0) {
		activeTab = tabs[0].id;
	}
});


/**
 * add a module to this extension
 * @param {Module} module - Module Object
 * @global
 */
function addModule(module) {
	module.init();
	modules.push(module);
}

/**
 * change the active state
 * @param {State} newState - new State
 * @global
 */
function changeActiveState(newState) {
	var oldState = activeState;
	activeState = newState;
	tabStates[activeTab] = activeState;
	activeState.run(oldState);
}

/**
 * change the active tab
 * @param {Number} newTabId - new tab id
 * @global
 */
function changeActiveTab(newTabId) {
	activeTab = newTabId;

	//stop recognition
	if (recognizing) {
		activeState.stopSpeechRecognition();
	}

	changeActiveState(tabStates[activeTab]);
}


//add listener to browser action
//noinspection JSUnusedLocalSymbols
/**
 * is called when the browser action button is clicked
 * @param {chrome.tabs.Tab} tab
 */
function browserAction(tab) {
	recognizing = !recognizing;
	if (recognizing) {
		//start recognition
		activeState.createWebkitSpeechRecognition();
		//change icon
		chrome.browserAction.setIcon({path:"../images/mic_on.png"});
	} else {
		//stop recognition
		activeState.stopSpeechRecognition();
		//change icon
		chrome.browserAction.setIcon({path:"../images/mic_off.png"});
	}
}
chrome.browserAction.onClicked.addListener(browserAction);


window.addEventListener("load", function() {
	if (!('webkitSpeechRecognition' in window)) {
		alert("webkitSpeechRecognition not available.");
	} else {
		changeActiveState(globalCommonState);
	}
}, false);


/**
 * activate the correct state of this tab
 * @param {Object} activeInfo
 */
function tabActivated(activeInfo) {
	if (!(activeInfo.tabId in tabStates)) {
		tabStates[activeInfo.tabId] = globalCommonState;
	} else {
		resizeUI();
	}
	changeActiveTab(activeInfo.tabId);
}
chrome.tabs.onActivated.addListener(tabActivated);


/**
 * remove remembered state if tab is closed
 * @param {Number} tabId
 */
function tabRemoved(tabId) {
	if (tabId in tabStates) {
		delete tabStates[tabId];
	}
}
chrome.tabs.onRemoved.addListener(tabRemoved);


/**
 * resizing ui in dependence to zoom level
 */
function resizeUI() {
	chrome.tabs.query({active:true, currentWindow:true}, function (tabs) {
		if (tabs.length > 0) {
			chrome.tabs.getZoom(tabs[0].id, function(zoomFactor) {
				callContentScriptMethod("setZoomFactor", {"zoomFactor":zoomFactor});
				//chrome.tabs.sendMessage(tabs[0].id, {callFunction: "setZoomFactor", params: {"zoomFactor":zoomFactor}});
			});
		}
	});
}
chrome.tabs.onZoomChange.addListener(resizeUI);
chrome.tabs.onUpdated.addListener(resizeUI);

/**
 * listener that checks if a tab is hand reloaded or a link is clicked by user
 * @param {Number} tabId
 * @param {Object} changeInfo
 */
function checkCorrectState(tabId, changeInfo) {
	if (changeInfo.hasOwnProperty("status") && changeInfo.status == "loading") {
		if (tabId == activeTab && activeState != globalCommonState) {
			//console.log("change active state");
			//stop recognition
			if (recognizing) {
				activeState.stopSpeechRecognition();
			}
			changeActiveState(globalCommonState);
		} else if (tabStates[tabId] != globalCommonState) {
			//console.log("change tab state");
			tabStates[tabId] = globalCommonState;
		}
	}
}
chrome.tabs.onUpdated.addListener(checkCorrectState);