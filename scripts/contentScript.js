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
		$("#ChromeSpeechControlIconMicrophone").attr("src",chrome.extension.getURL("images/microphone.png"));
		$("#ChromeSpeechControlIconSpeech").attr("src",chrome.extension.getURL("images/speech.png"));
		$("#ChromeSpeechControlIconThink").attr("src",chrome.extension.getURL("images/think.png"));
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
	} else if (request.callFunction == "setZoomFactor") {
		response = setZoomFactor(request.params);
	} else if (request.callFunction == "showMessage") {
		response = showMessage(request.params);
	} else if (request.callFunction == "updateMessage") {
		response = updateMessage(request.params);
	} else if (request.callFunction == "hideMessage") {
		response = hideMessage(request.params);
	} else if (request.callFunction == "showPanel") {
		response = showPanel(request.params);
	} else if (request.callFunction == "hidePanel") {
		response = hidePanel();
	} else if (request.callFunction == "elementResetScrolling") {
		response = elementResetScrolling(request.params);
	} else if (request.callFunction == "elementScrollDown") {
		response = elementScrollDown(request.params);
	} else if (request.callFunction == "elementScrollUp") {
		response = elementScrollUp(request.params);
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


/**
 * update microphone icon
 * @param {Object} params
 * @param {boolean} params.muted - microphone is muted
 * @param {boolean} params.hearing - microphone is hearing something
 * @param {boolean} params.working - microphone is working
 */
function updateMicrophoneIcon(params) {
	if (params.muted) {
		$("#ChromeSpeechControlIcon").attr("style", "background: #4B4B4B");
		$("#ChromeSpeechControlIconSpeech").attr("style", "display: none");
		$("#ChromeSpeechControlIconThink").attr("style", "display: none");
	} else {
		$("#ChromeSpeechControlIcon").attr("style", "background: #036490");
		if (params.hearing && params.working) {
			$("#ChromeSpeechControlIconSpeech").attr("style", "display: block");
			$("#ChromeSpeechControlIconThink").attr("style", "display: block");
		} else if (params.hearing) {
			$("#ChromeSpeechControlIconSpeech").attr("style", "display: block");
			$("#ChromeSpeechControlIconThink").attr("style", "display: none");
		} else if (params.working) {
			$("#ChromeSpeechControlIconSpeech").attr("style", "display: none");
			$("#ChromeSpeechControlIconThink").attr("style", "display: block");
		} else {
			$("#ChromeSpeechControlIconSpeech").attr("style", "display: none");
			$("#ChromeSpeechControlIconThink").attr("style", "display: none");
		}
	}
}


/**
 * set zoom factor of ui
 * @param {Object} params
 * @param {Number} params.zoomFactor - browser zoom factor
 */
function setZoomFactor(params) {
	$("#ChromeSpeechControlDIV").attr("style", "zoom: " + 1/params.zoomFactor);
}


var panelTimeoutId = -1;
/**
 * open the panel and add content, please use this only from content script methods
 * @param {Object} params
 * @param {String} params.html - html content of panel
 * @param {Number} [params.time=8000] - (optional) time how long the panel is shown in milliseconds (std 8000)
 * @param {Boolean} [params.cancelable=true] - (optional) show cancel action (std true)
 * @param {String} [params.commandLeft] - (optional) Command, that shown on bottom left
 * @param {String} [params.infoCenter] - (optional) information, that shown in the middle of commandLeft & commandRight
 * @param {String} [params.commandRight] - (optional) Command, that shown on bottom right
 * @param {Boolean} [params.fullHeight=false] - (optional) set panel height to max size
 * @param {Boolean} [params.noPadding=false] - (optional) set panel padding to zero
 */
function showPanel(params) {
	//generate html
	var html = "";
	if (typeof params.cancelable === 'undefined' || params.cancelable) {
		html += '<div class="top right">cancel</div>';
	}
	html += params.html;

	if (typeof params.commandLeft !== 'undefined' || typeof params.infoCenter !== 'undefined' || typeof params.commandRight !== 'undefined') {
		html += '<div class="bottom">';
		if (typeof params.infoCenter !== 'undefined') {
			html += params.infoCenter;
		}
		if (typeof params.commandLeft !== 'undefined') {
			html += '<div class="left">' + params.commandLeft + '</div>&nbsp;';
		}
		if (typeof params.commandRight !== 'undefined') {
			html += '&nbsp;<div class="right">' + params.commandRight + '</div>';
		}
		html += '</div>';
	}

	var panel = $("#ChromeSpeechControlPanel");
	panel.attr("style", "display:block");
	panel.html(html);

	//set class
	var elementClasses = "";
	if (typeof params.fullHeight !== 'undefined' && params.fullHeight) {
		elementClasses += "fullHeight ";
	}
	if (typeof params.noPadding !== 'undefined' && params.noPadding) {
		elementClasses += "noPadding ";
	}
	panel.attr("class", elementClasses);

	//clear last timeout
	if (typeof panelTimeoutId !== 'undefined' && panelTimeoutId >= 0) {
		clearTimeout(panelTimeoutId);
	}

	//set new timeout
	var time = (typeof params.time !== 'undefined') ? params.time : 8000; //set default value to 8000
	if (time > 0) {
		panelTimeoutId = setTimeout(function() {
			hidePanel();
			panelTimeoutId = -1;
		}, time);
	}
}

/**
 * hide a given message div
 */
function hidePanel() {
	$("#ChromeSpeechControlPanel")
		.attr("style", "display:none")
		.attr("class", "")
		.html("");
}


/**
 * reset the scrolling of an element
 * @param {Object} params
 * @param {String} params.id
 */
function elementResetScrolling(params) {
	$("#" + params.id).animate({scrollTop: 0}, 0);
}


/**
 * scroll a element up
 * @param {Object} params
 * @param {String} params.id
 */
function elementScrollUp(params) {
	var element = $("#" + params.id);

	var scrollHeight = element[0].clientHeight * 0.7;
	//noinspection JSValidateTypes
	var scrollPosVertical = element.scrollTop();

	var scrollTo = scrollPosVertical - scrollHeight;
	if (scrollTo < 0) scrollTo = 0;

	if(scrollTo < scrollPosVertical) {
		element.animate({scrollTop: scrollTo}, 1000);
	} else {
		showMessage({title: "Attention!", content: "Scrolling up isn't possible"});
	}
}


function elementScrollDown(params) {
	var element = $("#" + params.id);

	var scrollHeight = element[0].clientHeight * 0.7;
	//noinspection JSValidateTypes
	var scrollPosVertical = element.scrollTop();

	var scrollTo = scrollPosVertical + scrollHeight;
	var bottom = element[0].scrollHeight - element[0].clientHeight;
	if (scrollTo > bottom) scrollTo = bottom;

	if (scrollTo > scrollPosVertical) {
		element.animate({scrollTop: scrollTo}, 1000);
	} else {
		showMessage({title: "Attention!", content: "Scrolling down isn't possible"});
	}

}