
window.addEventListener("load", function() {
	if (!('webkitSpeechRecognition' in window)) {
		alert("error");
	} else {
		var recognition = new webkitSpeechRecognition();
		
		recognition.onstart = function(event) {
			event.target.abort();
		};
		
		recognition.start();
	}
}, false);
