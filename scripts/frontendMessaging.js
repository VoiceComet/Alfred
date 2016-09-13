
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
 * generate a message div which is "time" milliseconds visible
 * @param {Object} params
 * @param {String} [params.title] - title of message
 * @param {String} params.content - message content
 * @param {Array} [params.actions] - message actions
 * @param {Number} [params.time=4000] - (optional) time how long the message is shown in milliseconds
 * @param {Boolean} [params.cancelable=false] - (optional) show cancel action (std false)
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
	messageBox.appendChild(message);
	message.setAttribute("style", "display:block;");

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
 * @param {Array} [params.actions] - message actions
 * @param {Number} [params.time=4000] - (optional) time how long the message is shown in milliseconds
 * @param {Boolean} [params.cancelable=false] - (optional) show cancel action (std false)
 * @param {String} [params.commandLeft] - (optional) Command, that shown on bottom left
 * @param {String} [params.infoCenter] - (optional) information, that shown in the middle of commandLeft & commandRight
 * @param {String} [params.commandRight] - (optional) Command, that shown on bottom right
 * @return {String} - id of the message div
 */
function updateMessage(params) {
	//generate html
	var html = "";
	//add cancel action
	if (params.hasOwnProperty('cancelable') && params.cancelable) {
		html += '<div class="top right">cancel</div>';
	}
	//add title
	if (typeof params.title !== 'undefined' && params.title != '') {
		html += "<b>" + params.title + "</b><br/>";
	}
	//add content
	html += params.content + "<br/>";
	//add actions
	if (typeof params.actions !== 'undefined' && params.actions.length > 0) {
		html += "<br/><b>Say a number:</b><br/>";
		for (var i = 0; i < params.actions.length; i++) {
			html += params.actions[i].command + ": " + params.actions[i].description + "<br/>";
		}
	}
	//add commands left, right and infoCenter
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
				message.setAttribute("style", "display:none;");
				messageBox.removeChild(message);
				delete messageTimeouts[params.id];
			}, time)
		}
		return params.id;
	} else {
		console.log("message id " + params.id + " not found");
	}
	return null
}