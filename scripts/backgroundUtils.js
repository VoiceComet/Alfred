/**
 * import js file
 * @param {String} path
 * @global
 */
function importJsFile(path) {
	var imported = document.createElement('script');
	imported.src = path;
	document.head.appendChild(imported);
}

/**
 * notifies the user
 * @param {String} message - The shown message
 * @param {Number} [time=4000]  - (optional) in milliseconds (std. 3000), if time is 0 or smaller: return value is the notification, to close it in another way
 * @param {Function} [callback] - function(messageId){}, callback
 * @global
 */
function notify(message, time, callback) {
	callContentScriptMethod("showMessage", {content: message, centered: true, time: time}, callback);
}

/**
 * hide the given message
 * @param messageId
 */
function hideMessage(messageId) {
	callContentScriptMethod("hideMessage", {id:messageId});
}

/**
 * show a dialog box and a message box next to the microphone with a title, content, action headline and actions
 * @param {String} title - title of dialog
 * @param {String} content - content of dialog
 * @param {String} actionHeadline - shown headline of actions
 * @param {String} actions - shown actions of dialog
 * @param {Function} callback - function(messageId){}, callback
 * @global
 */
function showDialog(title, content, actionHeadline, actions, callback) {
	callContentScriptMethod("showDialog", {title: title, content: content, actionHeadline: actionHeadline, actions: actions, cancelable:true}, callback);
}

/**
 * hide the given dialog and message
 * @param messageId
 * @param dialogId
 */
function hideDialog(messageId, dialogId) {
	callContentScriptMethod("hideDialog", {messageId: messageId, dialogId: dialogId});
}

/**
 * send message to active front
 * @param {String} callFunction - call a function of content script
 * @param {Object} params - parameter for the called function
 * @param {Function} [callback] - optional callback function
 * @global
 */
function callContentScriptMethod(callFunction, params, callback) {
	chrome.tabs.query({active:true, currentWindow:true}, function (tabs) {
		if (tabs.length > 0) {
			chrome.tabs.sendMessage(
				//Selected tab id
				tabs[0].id,
				//Params inside a object data
				{callFunction: callFunction, params: params},
				//Optional callback function
				callback
			);
		}
	});
}


/**
 * speech assistant says something
 * @param {String} phrase - phrase that speech assistant should say
 * @param {Boolean} [sayTitle=true] - phrase that speech assistant should say
 * @param {Function} [callback] - optional callback function
 * @global
 */
function say(phrase, sayTitle, callback) {
	sayTitle = (sayTitle === undefined) ? true : sayTitle;

	chrome.storage.sync.get({
		speechAssistantSpeechOutput: true,
		speechAssistantVoice: 'Google UK English Male',
		speechAssistantUserTitle: 'Master',
		speechAssistantUserName: 'Wayne',
		speechAssistantSayTitle: true
	}, function(items) {
		//noinspection JSUnresolvedVariable
		if (!items.speechAssistantSpeechOutput) {
			return;
		}

		//deactivate hearing: against self hearing
		if (recognizing) {
			activeState.stopSpeechRecognition();
		}

		var msg = new SpeechSynthesisUtterance();
		msg.lang = "en-US";

		msg.text = phrase;
		//noinspection JSUnresolvedVariable
		if (items.speechAssistantSayTitle && sayTitle) {
			//noinspection JSUnresolvedVariable
			msg.text += ", " + items.speechAssistantUserTitle + " " + items.speechAssistantUserName;
		}

		var voices = speechSynthesis.getVoices().filter(function(voice) {
			//noinspection JSUnresolvedVariable
			return voice.voiceURI == items.speechAssistantVoice;
		});
		if (voices.length > 0) {
			msg.voice = voices[0];
			msg.lang = voices[0].lang;
		}

		//noinspection SpellCheckingInspection
		msg.onend = function(e) {
			//reactivate hearing: against self hearing
			if (recognizing) {
				activeState.createWebkitSpeechRecognition();
			}

			if (callback) {
				callback();
			}
		};

		speechSynthesis.speak(msg);
	});
}
speechSynthesis.speak(new SpeechSynthesisUtterance("")); //for async load of the voices at beginning