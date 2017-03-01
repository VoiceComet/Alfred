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
		stdValue: ""
	},
	{
		id : "searchEngine",
		type : "select",
		stdValue : "google"
	}
];
var voices = [];

var ownCommands = {
    "tabHandling": [
		{
			id: "reloadPage",
            shownText: "Reload Page",
			paramsCount: 0
		},
        {
            id: "goBack",
            shownText: "Go Back",
            paramsCount: 0
        },
        {
            id: "goForward",
            shownText: "Go Forward",
            paramsCount: 0
        }
	],
    "scrolling": [
        {
            id: "scrollTop",
            shownText: "scroll to Top",
            paramsCount: 0
        },
        {
            id: "scrollMiddle",
            shownText: "Scroll to Middle",
            paramsCount: 0
        },
        {
            id: "scrollBottom",
            shownText: "Scroll to Bottom",
            paramsCount: 0
        },
        {
            id: "scrollUp",
            shownText: "Scroll Up",
            paramsCount: 0
        },
        {
            id: "scrollDown",
            shownText: "Scroll Down",
            paramsCount: 0
        },
        {
            id: "scrollLeft",
            shownText: "Scroll Left",
            paramsCount: 0
        },
        {
            id: "scrollRight",
            shownText: "Scroll Right",
            paramsCount: 0
        }
	],
	"openURL": [
		{
			id: "openURL",
			shownText: "Open URL",
			paramsCount: 1
		}
	]
};

//fill actions for own commands
function loadOwnCommands() {
	var choosenModule = document.getElementById("chooseModule").value;
    var action = document.getElementById("chooseAction");
    var params = document.getElementById("params");
    while (action.hasChildNodes()) {
        action.removeChild(action.firstChild);
    }
    while (params.hasChildNodes()){
    	params.removeChild(params.firstChild);
	}
    if (ownCommands.hasOwnProperty(choosenModule)) {
    	var commands = ownCommands[choosenModule];
    	for (var i = 0; i < commands.length; i++) {
            var option = document.createElement("option");
            option.value = commands[i].id;
            option.text = commands[i].shownText.toLowerCase();
            for (var j = 0; j < commands[i].paramsCount; j++) {
            	var input = document.createElement("input");
                var label = document.createElement("label");
                label.innerHTML = "Param " + (j + 1);
                params.appendChild(label);
                params.appendChild(input);
			}
            document.getElementById("chooseAction").appendChild(option);
		}
	}
}
document.getElementById("chooseModule").addEventListener("change", loadOwnCommands);
document.addEventListener('DOMContentLoaded', loadOwnCommands);

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
	var command = document.getElementById("userCommand").value.toLowerCase();
	var action = document.getElementById("chooseAction").value;
	var params = document.getElementById("params");
    var warning = document.createElement("p");
    warning.setAttribute("style", "color: red");
    warning.id = "warning";
	if (document.getElementById(command) || command === "" || (params.hasChildNodes() && params.childNodes[1].value === "")) {
		if (command === "") {
            warning.innerHTML = "Please enter a command";
		} else if (document.getElementById(command.toLowerCase())){
            warning.innerHTML = "This command already exists";
		} else {
            warning.innerHTML = "This command requires parameter";
		}
        document.getElementById("addActions").appendChild(warning);
        setTimeout(function () {
            warning.remove();
        }, 2500);
	} else {
		var newDiv = document.createElement("div");
		newDiv.class = "setting";
		newDiv.id = command;
		var label = document.createElement("label");
        if (params.hasChildNodes()) {
            label.innerHTML = command + " | " + action;
            for (var j = 1; j < params.childNodes.length; j++) {
            	var labelInnerHTML = label.innerHTML;
            	var value = params.childNodes[j].value;
                label.innerHTML = labelInnerHTML + " | " + value.substring(value.indexOf(".") + 1) + " ";
            }
        } else {
            label.innerHTML = command + " | " + action + " ";
		}
		var deleteButton = document.createElement("button");
		deleteButton.class = "deleteButton";
		deleteButton.innerHTML = "Delete";
		newDiv
			.appendChild(label)
			.appendChild(deleteButton);
		document.getElementById("userCommands").appendChild(newDiv);
		deleteUserAction(newDiv.id);
		if (params.hasChildNodes()) {
            chrome.storage.sync.get(
                {ownCommands: []},
                /**
                 * @param {Object} results
                 * @param {Array} results.ownCommands
                 */
                function (results) {
                    results.ownCommands.push({
                        command: command,
                        action: action,
                        params: params.childNodes[1].value
                    });
                    chrome.storage.sync.set(results, function() {
                        //do nothing after saving
                    });
                }
            );
		} else {
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
                if (params.params) {
                    label.innerHTML = params.command + " | " + params.action + " | " + params.params.substring(params.params.indexOf(".") + 1) + " ";
                } else {
                    label.innerHTML = params.command + " | " + params.action + " ";
				}
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