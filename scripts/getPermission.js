
window.addEventListener("load", function() {
	if (!('webkitSpeechRecognition' in window)) {
		alert("error");
	} else {
		var recognition = new webkitSpeechRecognition();

		//noinspection SpellCheckingInspection
		recognition.onstart = function(event) {
			event.target.abort();
		};
		
		recognition.start();
	}
}, false);
