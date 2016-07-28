//import all modules
/** @global */
var contentScriptMethods = [];

/**
 * add a content script method to front page
 * @param {ContentScriptMethod} contentScriptMethod - Method which is called on front page
 * @global
 */
function addContentScriptMethod(contentScriptMethod) {
	contentScriptMethods.push(contentScriptMethod);
}


//load ui html
var ui = document.createElement('div');
$("<div></div>", {id: "ChromeSpeechControlDIV"})
	.appendTo($("body"))
	.load(chrome.extension.getURL("ui.html"), function() {
		$("#ChromeSpeechControlIcon").attr("src",chrome.extension.getURL("images/mic_normal.png"));
	});

//noinspection JSUnusedLocalSymbols
/**
 * Handle requests from background.html
 * @param {!{callFunction:String, params:Object}} request
 * @param sender
 * @param {Function} sendResponse
 */
function handleRequest(request, sender, sendResponse) {
	var response;
	if (request.callFunction == "updateMicrophoneIcon") {
		response = updateMicrophoneIcon(request.params);
	} else if (request.callFunction == "showMessage") {
		response = showMessage(request.params);
	} else if (request.callFunction == "hideMessage") {
		response = hideMessage(request.params);
	} else {
		//look for ContentScriptMethods of modules
		for (var i = 0; i < contentScriptMethods.length; i++) {
			if (request.callFunction == contentScriptMethods[i].name) {
				response = contentScriptMethods[i].method(request.params);
				break;
			}
		}
	}

	if (typeof response !== "undefined") {
	 	sendResponse(response);
	}
}
chrome.runtime.onMessage.addListener(handleRequest);


//var sidebarOpen = false;
/**
 * Small function which create a sidebar(just to illustrate my point)
 */
/*
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
*/

/**
 * generate a unique id
 * @return {String}
 */
function getUniqueId() {
	var generatedId = Math.floor(Math.random() * 26) + Date.now() + '';
	if (document.getElementById(generatedId) !== null) {
		return getUniqueId();
	}
	return generatedId;
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
 * generate a message div which is "time" milliseconds visible
 * @param {Object} params
 * @param {String} [params.title] - title of message
 * @param {String} params.content - message content
 * @param {Array} [params.actions] - message actions
 * @param {Number} [params.time=3000] - (optional) time how long the message is shown in milliseconds
 * @return {String} - id of the message div
 */
function showMessage(params) {
	var html = "";
	if (typeof params.title !== 'undefined' && params.title != '') {
		html = "<b>" + params.title + "</b><br/>";
	}
	html += params.content + "<br/>";
	if (typeof params.actions !== 'undefined' && params.actions.length > 0) {
		html += "<br/>";
		for (var i = 0; i < params.actions.length; i++) {
			html += params.actions[i].command + ": " + params.actions[i].description + "<br/>";
		}
	}

	var message = document.createElement('div');
	var id = getUniqueId();
	$(message)
		.addClass("ChromeSpeechControlMessage")
		.attr("id", id)
		.html(html)
		.appendTo($("#ChromeSpeechControlMessagesBox"))
		.show(400);

	var time = (typeof params.time !== 'undefined') ? params.time : 3000; //set default value to 3000
	if (time > 0) {
		setTimeout(function() {
			$(message).hide(400, function() {
				$(this).remove();
			});
		}, time)
	}
	return id;
}

/**
 * hide a given message div
 * @param {Object} params
 * @param {String} params.id - id of message div
 */
function hideMessage(params) {
	$('#'+params.id).hide(400, function() {
		$(this).remove();
	});
}