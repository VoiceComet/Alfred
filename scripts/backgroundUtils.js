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
 * notifies the user
 * @param {String} title - title of dialog
 * @param {String} content - content of dialog
 * @param {Array} actions - shown actions of dialog
 * @param {Function} callback - function(messageId){}, callback
 * @global
 */
function showDialog(title, content, actions, callback) {
	callContentScriptMethod("showMessage", {title: title, content: content, actions: actions, time: 0}, callback);
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