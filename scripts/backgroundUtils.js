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
	callContentScriptMethod("showMessage", {content: message, centered: true, time: time}, callback, false);
}

/**
 * hide the given message
 * @param messageId
 */
function hideMessage(messageId) {
	callContentScriptMethod("hideMessage", {id:messageId}, null, false);
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
	callContentScriptMethod("showDialog", {title: title, content: content, actionHeadline: actionHeadline, actions: actions, cancelable:true}, callback, false);
}

/**
 * hide the given dialog and message
 * @param messageId
 * @param dialogId
 */
function hideDialog(messageId, dialogId) {
	callContentScriptMethod("hideDialog", {messageId: messageId, dialogId: dialogId}, null, false);
}

/**
 * send message to active front
 * @param {String} callFunction - call a function of content script
 * @param {Object} params - parameter for the called function
 * @param {Function} [callback] - optional callback function
 * @param {boolean} [working=true] - optional update working icon
 * @global
 */
function callContentScriptMethod(callFunction, params, callback, working) {
	var cb = callback;
	if (typeof working === 'undefined' || working) {
		speechRecognitionControl.setWorking(true);
		cb = function() {
			if (typeof callback === Function) callback();
			speechRecognitionControl.setWorking(false);
		}
	}

	chrome.tabs.query({active:true, currentWindow:true}, function (tabs) {
		if (tabs.length > 0) {
			chrome.tabs.sendMessage(
				//Selected tab id
				tabs[0].id,
				//Params inside a object data
				{callFunction: callFunction, params: params},
				//Optional callback function
				cb
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
	console.debug("start saying", phrase);
	sayTitle = (sayTitle === undefined) ? true : sayTitle;

	//deactivate hearing: against self hearing
	speechRecognitionControl.setSaying(true);

	chrome.storage.sync.get({
		language: 'en',
		speechAssistantSpeechOutput: true,
		speechAssistantVoice: 'Google UK English Male',
		speechAssistantUserTitle: 'Master',
		speechAssistantUserName: 'Wayne',
		speechAssistantSayTitle: true
	}, function(items) {
		//noinspection JSUnresolvedVariable
		if (!items.speechAssistantSpeechOutput) {
			//reactivate hearing: against self hearing
			speechRecognitionControl.setSaying(false);
			return;
		}

		var msg = new SpeechSynthesisUtterance();
		msg.lang = items["language"];

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
			console.log("stop saying");
			//reactivate hearing: against self hearing
			speechRecognitionControl.setSaying(false);

			if (callback) {
				callback();
			}
		};

		//noinspection SpellCheckingInspection
		msg.onerror = function(e) {
			console.warn("SpeechSynthesisUtterance Error", e);
			this.onend(null);
		};

		speechSynthesis.speak(msg);
	});
}
speechSynthesis.speak(new SpeechSynthesisUtterance("")); //for async load of the voices at beginning

/**
 * find object in class group with given key
 * @param className - classname of a single class (module, state, action)
 * @param key - searched key
 * @return {Object}
 */
function getTranslationObject(className, key) {
	if (moduleLanguageJson.hasOwnProperty(className + "s")) {
		for (var i = 0; i < moduleLanguageJson[className + "s"].length; i++) {
			if (moduleLanguageJson[className + "s"][i][className] == key) {
				return moduleLanguageJson[className + "s"][i];
			}
		}
	}
	console.warn("could not find " + className + " " + key);
	return null;
}


/**
 *
 * @param key
 * @return {String}
 */
function getModuleTranslation(key) {
	var module = getTranslationObject("module", key);
	if (module != null) {
		return module["name"];
	}
	return key;
}

/**
 *
 * @param key
 * @return {String}
 */
function getStateTranslation(key) {
	var state = getTranslationObject("state", key);
	if (state != null) {
		return state["name"];
	}
	return key;
}

/**
 *
 * @param key
 * @return {String}
 */
function getActionTranslation(key) {
	var action = getTranslationObject("action", key);
	if (action != null) {
		return action["name"];
	}
	return key;
}

/**
 *
 * @param key
 * @return {Object}
 */
function getActionTranslationObject(key) {
	return getTranslationObject("action", key);
}


/**
 * format function to replace {number}-parts of a string
 * @param args
 * @returns {string}
 */
String.prototype.format = function (args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";
		} else {
			replace = "";
		}
		return replace;
	});
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

/**
 * translate key to actual language
 * @param {String} key
 * @return {String} translation
 */
function translate(key) {
	if (languageJson.hasOwnProperty(key)) {
		return languageJson[key];
	}
	console.warn("could not find translation of " + key);
	return key;
}