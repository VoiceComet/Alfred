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
	callContentScriptMethod("showMessage", {content: message, time: time}, callback);
}

/**
 * hide the given message
 * @param messageId
 */
function hideMessage(messageId) {
	callContentScriptMethod("hideMessage", {id:messageId});
}

/**
 * show an advanced dialog box next to the microphone with a title, content, actions and other commands in corners
 * @param {Object} params - parameters
 * @param {String} params.title - title of dialog
 * @param {String} params.content - content of dialog
 * @param {Array} [params.actions] - (optional) shown actions of dialog
 * @param {Boolean} [params.cancelable=false] - (optional) show cancel action (std true)
 * @param {String} [params.commandLeft] - (optional) Command, that shown on bottom left
 * @param {String} [params.commandRight] - (optional) Command, that shown on bottom right
 * @param {Function} callback - function(messageId){}, callback
 * @global
 */
function showAdvancedDialog(params, callback) {
	//noinspection JSUndefinedPropertyAssignment
	params.time = 0;
	callContentScriptMethod("showMessage", params, callback);
}

/**
 * show a dialog box next to the microphone with a title, content and actions
 * @param {String} title - title of dialog
 * @param {String} content - content of dialog
 * @param {Array} actions - shown actions of dialog
 * @param {Function} callback - function(messageId){}, callback
 * @global
 */
function showDialog(title, content, actions, callback) {
	showAdvancedDialog({title: title, content: content, actions: actions}, callback);
}

/**
 * hide the given dialog
 * @param messageId
 */
function hideDialog(messageId) {
	hideMessage(messageId);
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
 * @param {Function} [callback] - optional callback function
 * @global
 */
function say(phrase, callback) {
	chrome.storage.sync.get({
		speechAssistantVoice: 'Google UK English Male'
	}, function(items) {
		//deactivate hearing: against self hearing
		if (recognizing) {
			activeState.stopSpeechRecognition();
		}

		var msg = new SpeechSynthesisUtterance();
		msg.text = phrase;
		msg.lang = "en-US";

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