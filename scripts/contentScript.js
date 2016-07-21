//load ui html
window.addEventListener("load", function() {
	var ui = document.createElement('div');
	ui.id = "GoogleSpeechControlDIV";
	document.body.appendChild(ui);
	$("#GoogleSpeechControlDIV").load(chrome.extension.getURL("ui.html"), function() {
		$("#GoogleSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_normal.png"));
	});
}, false);

//noinspection JSUnusedLocalSymbols
/**
 * Handle requests from background.html
 * @param {!{callFunction:String, params:Object}} request
 * @param sender
 * @param sendResponse
 */
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar")
		toggleSidebar();
	else if (request.callFunction == "updateMicrophoneIcon")
		updateMicrophoneIcon(request.params);
}
chrome.runtime.onMessage.addListener(handleRequest);

var sidebarOpen = false;
/**
 * Small function which create a sidebar(just to illustrate my point)
 */
function toggleSidebar() {
	if(sidebarOpen) {
		var el = document.getElementById('mySidebar');
		el.parentNode.removeChild(el);
		sidebarOpen = false;
	}
	else {
		var sidebar = document.createElement('div');
		sidebar.id = "mySidebar";
		sidebar.innerHTML = "\
			<h1>Hello</h1>\
			World!\
		";
		sidebar.style.cssText = "\
			position:fixed;\
			top:0px;\
			right:0px;\
			width:30%;\
			height:100%;\
			background:white;\
			box-shadow:inset 0 0 1em black;\
			z-index:999999;\
		";
		document.body.appendChild(sidebar);
		sidebarOpen = true;
	}
}

/**
 * update microphone icon
 * @param {Object} params
 * @param {boolean} params.muted - microphone is muted
 * @param {boolean} params.hearing - microphone is hearing something
 * @param {boolean} params.working - microphone is working
 */
function updateMicrophoneIcon(params) {
	if (params.muted) {
		$("#GoogleSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_muted.png"));
	} else {
		if (params.hearing && params.working) {
			$("#GoogleSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_both.png"));
		} else if (params.hearing) {
			$("#GoogleSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_hear.png"));
		} else if (params.working) {
			$("#GoogleSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_work.png"));
		} else {
			$("#GoogleSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_normal.png"));
		}
	}
}
