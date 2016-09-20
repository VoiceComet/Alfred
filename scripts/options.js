// Saves options to chrome.storage.sync.
function save_options() {
	var searchEngine = document.getElementById('searchEngine').value;
	var speechAssistantVoice = document.getElementById('speechAssistantVoice').value;
	chrome.storage.sync.set({
		searchEngine: searchEngine,
		speechAssistantVoice: speechAssistantVoice
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		searchEngine: 'google',
		speechAssistantVoice: 'Google UK English Male'
	}, function(items) {
		//noinspection JSUnresolvedVariable
		document.getElementById('searchEngine').value = items.searchEngine;

		//load possible voices
		//noinspection SpellCheckingInspection
		window.speechSynthesis.onvoiceschanged = function() {
			var voices = window.speechSynthesis.getVoices().filter(function(voice) {
				return voice.lang == "en-GB" || voice.lang == "en-US";
			});
			var selectElement = document.getElementById("speechAssistantVoice");
			selectElement.innerHTML = ""; //delete content
			for (var i = 0; i < voices.length; i++) {
				var option = document.createElement('option');
				option.setAttribute("value", voices[i].voiceURI);
				option.innerHTML = voices[i].name;
				selectElement.appendChild(option);
			}

			//set default
			//noinspection JSUnresolvedVariable
			document.getElementById('speechAssistantVoice').value = items.speechAssistantVoice;
		};
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);