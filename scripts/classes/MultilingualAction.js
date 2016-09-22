/**
 * Action where you can set command parameters of a given action in another language. Do not set the act function
 * @extends Action
 * @param {String} name - name of action
 * @param {Action} relatedAction - related action
 * @constructor
 */
function MultilingualAction(name, relatedAction) {
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
		var dialogActions = [];
		dialogActions.push({command: "english", description: "english Language"});
		dialogActions.push({command: "german", description: "deutsche Sprache"});
		dialogActions.push({command: "spanish", description: "idioma español"});
		dialogActions.push({command: "french", description: "langue française"});
		dialogActions.push({command: "turkish", description: "türk dili"});
		dialogActions.push({command: "russian", description: "русский язык"});
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
	chooseLanguageAction.addCommand(new Command("(english)", 1));
	chooseLanguageAction.addCommand(new Command("(german)", 1));
	chooseLanguageAction.addCommand(new Command("(spanish)", 1));
	chooseLanguageAction.addCommand(new Command("(french)", 1));
	chooseLanguageAction.addCommand(new Command("(turkish)", 1));
	chooseLanguageAction.addCommand(new Command("(russian)", 1));
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
			notify("say your parameter in chosen language", 0, function(messageId) {
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
		};
		sayParameterState.addAction(sayParameterAction);

		this.followingState = sayParameterState;
	};
	chooseLanguageState.addAction(chooseLanguageAction);

	// Call the parent constructor
	Action.call(this, name, 0, chooseLanguageState);
}