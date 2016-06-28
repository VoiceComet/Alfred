var globalCommonState = new State("GlobalCommonState");
globalCommonState.init = function () {
	this.actions = [];
	//add actions of modules
	for (var i = 0; i < modules.length; i++) {
		for (var j = 0; j < modules[i].actions.length; j++) {
			this.addAction(modules[i].actions[j]);
		}
	}
};

var activeState;
var modules = [];
var permissionGrounded = true;

function addModule(module) {
	module.init();
	modules.push(module);
}

function changeActiveState(newState) {
	activeState = newState;
	activeState.run();
}

//import modules
importJsFile("scripts/modules/moduleList.js");


//add listener to browser action
chrome.browserAction.onClicked.addListener(function () {
	activeState.recognizing = !activeState.recognizing;
	if (activeState.recognizing) {
		//start recognition
		activeState.createWebkitSpeechRecognition();
		//change icon 
		chrome.browserAction.setIcon({path:"../images/mic_on.png"});
	} else {
		//start recognition
		activeState.stopSpeechRecognition();
		//change icon 
		chrome.browserAction.setIcon({path:"../images/mic_off.png"});
	}
});


window.addEventListener("load", function() {
	if (!('webkitSpeechRecognition' in window)) {
		alert("webkitSpeechRecognition not available.");
	} else {
		changeActiveState(globalCommonState);
	}
}, false);


