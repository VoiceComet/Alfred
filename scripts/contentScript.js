//load ui css
$("<link/>", {
	rel: "stylesheet",
	type: "text/css",
	href: chrome.extension.getURL("ui.css")
}).appendTo("head");
//load ui html
var ui = document.createElement('div');
ui.id = "ChromeSpeechControlDIV";
document.body.appendChild(ui);
$("#ChromeSpeechControlDIV").load(chrome.extension.getURL("ui.html"), function() {
	$("#ChromeSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_normal.png"));
});


//noinspection JSUnusedLocalSymbols
/**
 * Handle requests from background.html
 * @param {!{callFunction:String, params:Object}} request
 * @param sender
 * @param sendResponse
 */
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar") {
		toggleSidebar();
	} else if (request.callFunction == "updateMicrophoneIcon") {
		updateMicrophoneIcon(request.params);
	} else if (request.callFunction == "showMessage") {
		showMessage(request.params);
	}
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
		$("#ChromeSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_muted.png"));
	} else {
		if (params.hearing && params.working) {
			$("#ChromeSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_both.png"));
		} else if (params.hearing) {
			$("#ChromeSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_hear.png"));
		} else if (params.working) {
			$("#ChromeSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_work.png"));
		} else {
			$("#ChromeSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_normal.png"));
		}
	}
}

/**
 * update microphone icon
 * @param {Object} params
 * @param {String} params.title - title of message
 * @param {String} params.content - message content
 * @param {Number} [params.time=3000] - (optional) time how long the message is shown in milliseconds
 */
function showMessage(params) {
	var message = document.createElement('div');
	$(message)
		.addClass("ChromeSpeechControlMessage")
		.html("<b>" + params.title + "</b><br/>" + params.content)

		.appendTo($("#ChromeSpeechControlMessagesBox"))
		.show(400);

	var time = (typeof params.time !== 'undefined') ? params.time : 3000; //set default value to 3000
	if (time > 0) {
		setTimeout(function() {
			//message.fadeOut();
			$(message).hide(400, function() {
				$(this).remove();
			});
		}, time)
	}

}