
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
 * hide a given html element
 * @param {Object} params
 * @param {String} params.elementId - id of element
 * @param {String} [params.parentId] - (optional) id of parent
 */
function hideAlfredElement(params) {
	var element = document.getElementById(params.elementId);
	element.setAttribute("style", "-webkit-animation: fadeOut 500ms steps(20);");
	setTimeout(function () {
		element.setAttribute("style", "display:none;");
		if (params.hasOwnProperty("parentId")) {
			document.getElementById(params.parentId).removeChild(element);
		}
	}, 490);
}

/**
 * generate a message div which is "time" milliseconds visible
 * @param {Object} params
 * @param {String} [params.title] - title of message
 * @param {String} params.content - message content
 * @param {Array} [params.actions] - message actions
 * @param {Number} [params.time=4000] - (optional) time how long the message is shown in milliseconds
 * @param {Boolean} [params.cancelable=false] - (optional) show cancel action (std false)
 * @param {Boolean} [params.centered=false] - (optional) center content (std false)
 * @param {String} [params.commandLeft] - (optional) Command, that shown on bottom left
 * @param {String} [params.infoCenter] - (optional) information, that shown in the middle of commandLeft & commandRight
 * @param {String} [params.commandRight] - (optional) Command, that shown on bottom right
 * @return {String} - id of the message div
 */
function showMessage(params) {
	var messageBox = document.getElementById("ChromeSpeechControlMessagesBox");

	var message = document.createElement('div');
	var id = getUniqueId();
	message.setAttribute("id", id);
	message.setAttribute("class", "ChromeSpeechControlMessage");
	message.setAttribute("style", "-webkit-animation: fadeInLeftMessage 500ms steps(20);");
	messageBox.appendChild(message);

	//noinspection JSUndefinedPropertyAssignment
	params.id = id;
	//noinspection JSCheckFunctionSignatures
	return updateMessage(params);
}

var messageTimeouts = [];
/**
 * update a given message div which is "time" milliseconds visible
 * @param {Object} params
 * @param {String} params.id - id of message element
 * @param {String} [params.title] - title of message
 * @param {String} params.content - message content
 * @param {Number} [params.time=4000] - (optional) time how long the message is shown in milliseconds
 * @param {Boolean} [params.cancelable=false] - (optional) show cancel action (std false)
 * @param {Boolean} [params.centered=false] - (optional) center content (std false)
 * @param {String} [params.commandLeft] - (optional) Command, that shown on bottom left
 * @param {String} [params.infoCenter] - (optional) information, that shown in the middle of commandLeft & commandRight
 * @param {String} [params.commandRight] - (optional) Command, that shown on bottom right
 * @return {String} - id of the message div
 */
function updateMessage(params) {
	//generate html
	var html = "";

	if ((params.hasOwnProperty('cancelable') && params.cancelable) || (typeof params.title !== 'undefined' && params.title != '') || (params.hasOwnProperty('centered') && params.centered)) {
		html += '<div class="top">';
		//add title
		if (typeof params.title !== 'undefined' && params.title != '') {
			html += '<div class="title">' + params.title + '</div>';
		} else if (params.hasOwnProperty('centered') && params.centered) {
			html += '<div class="title"></div><br/>';
		}
		//add cancel action
		if (params.hasOwnProperty('cancelable') && params.cancelable) {
			html += '<div class="right">cancel</div>';
		}
		html += '</div>';
	}
	//add content
	html += params.content + "<br/>";
	//add commands left, right and infoCenter
	if (typeof params.commandLeft !== 'undefined' || typeof params.infoCenter !== 'undefined' || typeof params.commandRight !== 'undefined') {
		html += '<div class="bottom">';
		if (typeof params.commandLeft !== 'undefined') {
			html += '<div class="left">' + params.commandLeft + '</div>&nbsp;';
		}
		if (typeof params.infoCenter !== 'undefined') {
			html += '<div class="infoCenter">' + params.infoCenter + '</div>&nbsp;';
		}
		if (typeof params.commandRight !== 'undefined') {
			html += '&nbsp;<div class="right">' + params.commandRight + '</div>';
		}
		html += '</div>';
	}

	var messageBox = document.getElementById("ChromeSpeechControlMessagesBox");
	var message = document.getElementById(params.id);
	if (message) {

		message.innerHTML = html;

		//clear last timeout
		if (typeof messageTimeouts[params.id] !== 'undefined' && messageTimeouts[params.id] >= 0) {
			clearTimeout(messageTimeouts[params.id]);
		}

		var time = (typeof params.time !== 'undefined') ? params.time : 4000; //set default value to 4000
		if (time > 0) {
			messageTimeouts[params.id] = setTimeout(function() {
				message.setAttribute("style", "-webkit-animation: fadeOut 500ms steps(20);");
				setTimeout(function () {
					message.setAttribute("style", "display:none;");
					messageBox.removeChild(message);
				}, 490);
				delete messageTimeouts[params.id];
			}, time)
		}
		return params.id;
	} else {
		console.log("message id " + params.id + " not found");
	}
	return null
}


/**
 * hide a given message div
 * @param {Object} params
 * @param {String} params.id - id of message div
 */
function hideMessage(params) {
	hideAlfredElement({elementId:params.id, parentId: "ChromeSpeechControlMessagesBox"});
}


/**
 * show a dialog box next to the microphone with a title, content, action headline, actions and other commands in corners
 * @param {Object} params - parameters
 * @param {String} params.title - title of dialog
 * @param {String} params.content - content of dialog
 * @param {String} params.actionHeadline - shown headline of actions
 * @param {Array} params.actions - shown actions of dialog
 * @param {Boolean} [params.cancelable=false] - (optional) show cancel action (std true)
 * @param {String} [params.commandLeft] - (optional) Command, that shown on bottom left
 * @param {String} [params.commandRight] - (optional) Command, that shown on bottom right
 */
function showDialog(params) {
	console.log(params);
	//show extended content
	var dialogBox = document.getElementById("ChromeSpeechControlDialogs");
	var dialog = document.createElement('div');
	var dialogId = getUniqueId();
	dialog.setAttribute("id", dialogId);
	dialog.setAttribute("class", "ChromeSpeechControlDialog");
	dialog.setAttribute("style", "-webkit-animation: fadeInLeftMessage 500ms steps(20);");
	//add actions
	var html = "";
	if (typeof params.actions !== 'undefined' && params.actions.length > 0) {
		html += "<b>" + params.actionHeadline + "</b><br/>";
		for (var i = 0; i < params.actions.length; i++) {
			html += params.actions[i].command + ": " + params.actions[i].description + "<br/>";
		}
	}
	dialog.innerHTML = html;
	dialogBox.appendChild(dialog);

	//show message
	params.time = 0;
	var messageId = showMessage(params);
	return {messageId: messageId, dialogId: dialogId};
}


/**
 * hide a given message div and dialog div
 * @param {Object} params
 * @param {String} params.messageId - id of message div
 * @param {String} params.dialogId - id of message div
 */
function hideDialog(params) {
	hideMessage({id: params.messageId});
	hideAlfredElement({elementId:params.dialogId, parentId: "ChromeSpeechControlDialogs"});
}