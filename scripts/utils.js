/**
 * import js file
 * string path
**/
function importJsFile(path) {
	var imported = document.createElement('script');
	imported.src = path;
	document.head.appendChild(imported);
}

/**
 * notifies the user
 * string message: The shown message
 * (optional) int time: in millisecounds (std. 3000)
		if time is 0 or smaller: return value is the notification, to close it in another way
**/
function notify(message, time) {
	time = (typeof time !== 'undefined') ? time : 3000; //set default value to 3000
	if (!Notification) {
		alert('Desktop notifications not available in your browser.');
		return;
	}

	if (Notification.permission !== "granted")
		Notification.requestPermission();
	else {
		var notification = new Notification('Chrome Speech Control', {
			icon: "../images/mic_on.png",
			body: message
		});
		if (time > 0) {
			setTimeout(function() {notification.close()}, time); // close notification after time millisecounds
		} else {
			return notification;
		}
	}
}

/**
 * write a message into the background page console
 * string message
**/
function log(message) {
	console.log(message);
}


/**
 * open a sidebar in current tab
 *
**/
function openSidebar() {
	chrome.tabs.query({active:true, currentWindow:true}, function (tabs) {
		chrome.tabs.sendRequest(
			//Selected tab id
			tabs[0].id,
			//Params inside a object data
			{callFunction: "toggleSidebar"},
			//Optional callback function
			function(response) {
				console.log(response);
			}
		);
	});
}
