/**
 * Action where you can set command parameters of a given action in another language. Do not set the act function
 * @extends Action
 * @param {String} name - name of action
 * @param {Action} relatedAction - related action
 * @param {{notify: String, say: String}[]} settings - for each parameter one element in this array
 * @constructor
 */
function MultilingualAction(name, relatedAction, settings) {
	/** @type {Action} */
	this.relatedAction = relatedAction;

	var that = this;

	//create choose language state
	var chooseLanguageState = new State("Choose Language");
	chooseLanguageState.hideDialog = function () {
		hideDialog(this.messageId);
	};
	chooseLanguageState.setMessageId = function (messageId) {
		this.messageId = messageId;
	};
	chooseLanguageState.init = function() {
		var languageState = this;

		//show dialog with languages
		var dialogActions = [
			{command: "english", description: "english Language"},
			{command: "german", description: "deutsche Sprache"},
			{command: "spanish", description: "idioma español"},
			{command: "french", description: "langue française"},
			{command: "turkish", description: "türk dili"},
			{command: "russian", description: "русский язык"}
		];
		showDialog("Choose a Language", "", dialogActions, function (messageId) {
			languageState.setMessageId(messageId);
		});

		//close dialog at cancel
		this.cancelAction.act = function() {
			languageState.hideDialog();
			notify("canceled");
		};
	};
	//create choose language action
	var chooseLanguageAction = new Action("Choose Language", 1, null);
	chooseLanguageAction.chooseLanguageState = chooseLanguageState;
	chooseLanguageAction.addCommands([
		new Command("(english)", 1),
		new Command("(german)", 1),
		new Command("(spanish)", 1),
		new Command("(french)", 1),
		new Command("(turkish)", 1),
		new Command("(russian)", 1)
	]);
	chooseLanguageAction.act = function(arguments) {
		this.chooseLanguageState.hideDialog();

		var lang;
		switch(arguments[0].toLowerCase()) {
			case "english": lang = "en"; break;
			case "german": lang = "de"; break;
			case "spanish": lang = "es"; break;
			case "french": lang = "fr"; break;
			case "turkish": lang = "tr"; break;
			case "russian": lang = "ru"; break;
			default: lang = "en"
		}
		//create following state and action
		var sayParameterState = new State("Say Parameter");
		sayParameterState.lang = lang;
		sayParameterState.hideDialog = function () {
			hideDialog(this.messageId);
		};
		sayParameterState.setMessageId = function (messageId) {
			this.messageId = messageId;
		};
		sayParameterState.init = function() {
			var sayParamState = this;

			var paramText = "say your parameter in chosen language";
			if (settings.length >= 1) {
				if (settings[0].hasOwnProperty("notify") && settings[0].notify != "") {
					paramText = settings[0].notify;
				}

				if (settings[0].hasOwnProperty("say") && settings[0].say != "") {
					say(settings[0].say);
				}
			}
			notify(paramText, 0, function(messageId) {
				sayParamState.setMessageId(messageId);
			});
			this.ableToCancel = false;
			this.ableToMute = false;
		};
		var sayParameterAction = new Action("Say Parameter", 1, that.relatedAction.followingState);
		sayParameterAction.addCommand(new Command("(.+)", 1));
		sayParameterAction.sayParameterState = sayParameterState;
		sayParameterAction.act = function(arguments) {
			this.sayParameterState.hideDialog();
			that.relatedAction.act(arguments);
			//action can change the following state
			//noinspection JSPotentiallyInvalidUsageOfThis
			this.followingState = that.relatedAction.followingState;
		};
		sayParameterState.addAction(sayParameterAction);

		this.followingState = sayParameterState;
	};
	chooseLanguageState.addAction(chooseLanguageAction);

	// Call the parent constructor
	Action.call(this, name, 0, chooseLanguageState);
}