/**
 * list of all options
 * @type {Object[]}
 */
var options = [
	{
		id : "speechAssistantName",
		type : "text",
		stdValue : "Alfred"
	},
	{
		id : "speechAssistantSpeechOutput",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "speechAssistantVoice",
		type : "select",
		stdValue : "Google UK English Male"
	},
	{
		id : "speechAssistantUserTitle",
		type : "select",
		stdValue : "Master"
	},
	{
		id : "speechAssistantUserName",
		type : "text",
		stdValue : "Wayne"
	},
	{
		id : "speechAssistantSayTitle",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "browserActionsModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "weatherModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "zoomModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "searchModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "videoModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "searchEngineModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "mapModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "bookmarkModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "linkModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id : "imageModule",
		type : "checkbox",
		stdValue : true
	},
	{
		id: "userCommand",
		type: "text",
		stdValue: "Add Command"
	},
	{
		id: "chooseAction",
		type: "select",
		stdValue: "ReloadPage"

	},
	{
		id : "searchEngine",
		type : "select",
		stdValue : "google"
	}
];

/**
 * list of all user actions
 * @type {Object[]}
 */
var userActions = [
	{
		command: "default",
		action: "default"
	}
];

//add onClickListener for adding commands
document.getElementById("AddButton").addEventListener("click", function () {
	var command = document.getElementById("userCommand").value;
	var action = document.getElementById("chooseAction").value;
	var userInteraction = {command: command, action: action};
	userActions.push(userInteraction);
	var save = {};
	save[userActions[command]] = userInteraction;
	chrome.storage.sync.set(save, function() {
		var newDiv = document.createElement("div");
		newDiv.class = "setting";
		newDiv.id = command;
		var element = document.createElement("label");
		element.innerHTML = command + " | " + action + " ";
		var deleteButton = document.createElement("button");
		deleteButton.innerHTML = "Delete";
		deleteButton.class = "deleteButton";
		deleteButton.id = command;
		document.getElementById("userInteraction").appendChild(newDiv);
		document.getElementById(command)
			.appendChild(element)
			.appendChild(deleteButton);
	});
});

//add OnClickListener for deleting commands
/**document.getElementsByClassName("deleteButton").addEventListener("click", function () {
	var id = this.id;
	var save = {};
	var settings = document.getElementsByClassName("setting");
	for (var i = 0; i < settings.length; i++) {
		if (settings[i].id = id) {
			var element = settings[i];
			chrome.storage.sync.set(save, function () {
				element.remove();
			})
		}
	}
});*/

//add onChangeListener for saving
options.forEach(function (option) {
	var type = 'change';
	if (option.type == 'text') {
		type = 'input';
	}

	document.getElementById(option.id).addEventListener(type, function() {
		var value;
		if (option.type == "checkbox") {
			value = document.getElementById(option.id).checked
		} else {
			value = document.getElementById(option.id).value
		}

		var save = {};
		save[option.id] = value;

		chrome.storage.sync.set(save, function() {
			//do nothing after saving
		});
	});
});

/**
 * restore all saved options after dom loaded
 */
function restore_options() {
	var stdValues = {};
	options.forEach(function (option) {
		stdValues[option.id] = option.stdValue;
	});

	chrome.storage.sync.get(stdValues, function(items) {
		options.forEach(function (option) {
			if (option.id == 'speechAssistantVoice') {
				//for voice loading
				//noinspection SpellCheckingInspection
				window.speechSynthesis.onvoiceschanged = function() {
					var optionId = 'speechAssistantVoice';
					var voices = window.speechSynthesis.getVoices().filter(function(voice) {
						return voice.lang == "en-GB" || voice.lang == "en-US";
					});
					var selectElement = document.getElementById(optionId);
					selectElement.innerHTML = ""; //delete content
					for (var i = 0; i < voices.length; i++) {
						var option = document.createElement('option');
						option.setAttribute("value", voices[i].voiceURI);
						option.innerHTML = voices[i].name;
						selectElement.appendChild(option);
					}

					//set default
					document.getElementById(optionId).value = items[optionId];
				};
			} else {
				if (option.type == "checkbox") {
					document.getElementById(option.id).checked = items[option.id];
				} else {
					document.getElementById(option.id).value = items[option.id];
				}
			}
		});
	});
}
document.addEventListener('DOMContentLoaded', restore_options);