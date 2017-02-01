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
		id : "speechAssistantLanguage",
		type : "select",
		stdValue : "en"
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
		stdValue: "reloadPage"

	},
	{
		id : "searchEngine",
		type : "select",
		stdValue : "google"
	}
];

//add OnClickListener for deleting commands
var deleteUserAction = function (params) {
	var button = document.getElementById(params);
	button.addEventListener("click", function () {
		chrome.storage.sync.get(
			{ownCommands: []},
            /**
             * @param {Object} results
             * @param {Array} results.ownCommands
             */
			function (results) {
				for (var i = 0; i < results.ownCommands.length; i++) {
					if (results.ownCommands[i].command === params) {
						results.ownCommands.splice(i, 1);
					}
				}
				chrome.storage.sync.set(results, function () {
					document.getElementById(params).remove();
				})
			}
		);
	});
};

//add onClickListener for adding commands
document.getElementById("addButton").addEventListener("click", function () {
	var command = document.getElementById("userCommand").value;
	var action = document.getElementById("chooseAction").value;
	if (document.getElementById(command)) {
		var warning = document.createElement("p");
		warning.id = "warning";
		warning.innerHTML = "This command already exists";
		warning.setAttribute("style", "color: red");
		document.getElementById("addActions").appendChild(warning);
		setTimeout(function () {
			warning.remove();
		}, 2500);
	} else {
		var newDiv = document.createElement("div");
		newDiv.class = "setting";
		newDiv.id = command;
		var label = document.createElement("label");
		label.innerHTML = command + " | " + action + " ";
		var deleteButton = document.createElement("button");
		deleteButton.class = "deleteButton";
		deleteButton.innerHTML = "Delete";
		newDiv
			.appendChild(label)
			.appendChild(deleteButton);
		document.getElementById("userCommands").appendChild(newDiv);
		deleteUserAction(newDiv.id);
		chrome.storage.sync.get(
			{ownCommands: []},
            /**
             * @param {Object} results
             * @param {Array} results.ownCommands
             */
			function (results) {
				results.ownCommands.push({
					command: command,
					action: action
				});
				chrome.storage.sync.set(results, function() {
					//do nothing after saving
				});
			}
		);
	}
});

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

	chrome.storage.sync.get(
		{ownCommands: []},
        /**
         * @param {Object} results
         * @param {Array} results.ownCommands
         */
		function (results) {
			results.ownCommands.forEach(function (params) {
				var newDiv = document.createElement("div");
				newDiv.class = "setting";
				newDiv.id = params.command;
				var label = document.createElement("label");
				label.innerHTML = params.command + " | " + params.action + " ";
				var deleteButton = document.createElement("button");
				deleteButton.class = "deleteButton";
				deleteButton.innerHTML = "Delete";
				newDiv
					.appendChild(label)
					.appendChild(deleteButton);
				document.getElementById("userCommands").appendChild(newDiv);
				deleteUserAction(newDiv.id);
			});
		}
	)
}
document.addEventListener('DOMContentLoaded', restore_options);