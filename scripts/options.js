/**
 * list of all options
 * @type {Object[]}
 */
var options = [
	{
		id : "language",
		type : "select",
		stdValue : "en"
	},
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
		id : "tabHandleModule",
		type : "checkbox",
		stdValue : true
	},
    {
        id : "scrollModule",
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
		id : "searchEngine",
		type : "select",
		stdValue : "google"
	}
];
var voices = [];


//fill actions for own commands
document.getElementById("chooseModule").addEventListener("change", function () {
	var choosenModule = document.getElementById("chooseModule").value;
    var action = document.getElementById("chooseAction");
    while (action.hasChildNodes()) {
        action.removeChild(action.firstChild);
    }
	if (choosenModule === "tabHandling") {
        var o0 = document.createElement("option");
        o0.value = "reloadPage";
        o0.text = "Reload Page";
        var o1 = document.createElement("option");
        o1.value = "goBack";
        o1.text = "Go Back";
        var o2 = document.createElement("option");
        o2.value = "goForward";
        o2.text = "Go Forward";
        document.getElementById("chooseAction").appendChild(o0);
        document.getElementById("chooseAction").appendChild(o1);
        document.getElementById("chooseAction").appendChild(o2);
	} else {
        var o3 = document.createElement("option");
        o3.value = "scrollTop";
        o3.text = "scroll to Top";
        var o4 = document.createElement("option");
        o4.value = "scrollMiddle";
        o4.text = "Scroll to Middle";
        var o5 = document.createElement("option");
        o5.value = "scrollBottom";
        o5.text = "Scroll to Bottom";
        var o6 = document.createElement("option");
        o6.value = "scrollUp";
        o6.text = "Scroll Up";
        var o7 = document.createElement("option");
        o7.value = "scrollDown";
        o7.text = "Scroll Down";
        var o8 = document.createElement("option");
        o8.value = "scrollLeft";
        o8.text = "Scroll Left";
        var o9 = document.createElement("option");
        o9.value = "scrollRight";
        o9.text = "Scroll Right";
        document.getElementById("chooseAction").appendChild(o3);
        document.getElementById("chooseAction").appendChild(o4);
        document.getElementById("chooseAction").appendChild(o5);
        document.getElementById("chooseAction").appendChild(o6);
        document.getElementById("chooseAction").appendChild(o7);
        document.getElementById("chooseAction").appendChild(o8);
        document.getElementById("chooseAction").appendChild(o9);
	}
});

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

	function refreshVoices(defaultValue) {
		chrome.storage.sync.get({language:'en'}, function(items) {
			var optionId = 'speechAssistantVoice';
			var lang = items["language"];
			var defaultSetted = false;
			var langVoices = voices.filter(function(voice) {
				if (lang == 'de') {
					return voice.lang == "de-DE";
				} else {
					return voice.lang == "en-GB" || voice.lang == "en-US";
				}
			});
			var selectElement = document.getElementById(optionId);
			selectElement.innerHTML = ""; //delete content
			for (var i = 0; i < langVoices.length; i++) {
				var option = document.createElement('option');
				option.setAttribute("value", langVoices[i].voiceURI);
				option.innerHTML = langVoices[i].name;
				selectElement.appendChild(option);
				//set default
				if (langVoices[i].voiceURI == defaultValue) {
					selectElement.value = langVoices[i].voiceURI;
					defaultSetted = true;
				}
			}
			if (!defaultSetted) {
				if (lang == 'en') {
					selectElement.value = stdValues[optionId]
				} else {
					selectElement.value = langVoices[0].voiceURI;
				}
				chrome.storage.sync.set({'speechAssistantVoice': selectElement.value}, function() {
					//do nothing after saving
				});
			}
		});
	}

	function optionChangeListener(changes) {
		for (var key in changes) {
			if (key == "language") {
				refreshVoices(null);
			}
		}
	}
	chrome.storage.onChanged.addListener(optionChangeListener);

	chrome.storage.sync.get(stdValues, function(items) {
		options.forEach(function (option) {
			if (option.id == 'speechAssistantVoice') {
				//for voice loading
				//noinspection SpellCheckingInspection
				window.speechSynthesis.onvoiceschanged = function() {
					voices = window.speechSynthesis.getVoices();
					refreshVoices(items['speechAssistantVoice']);
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