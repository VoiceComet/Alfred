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

	/**
	 * generate choose language state, choose language action, say parameter state, say parameter
	 * action for every parameter of related action
	 * @param {Number} parameterNumber
	 * @param {String[]} [spokenParameter]
	 * @return {State} - generated state for given argumentNumber
	 */
	function generateStatesAndActions(parameterNumber, spokenParameter) {
		//create choose language state
		var chooseLanguageState = new State("Choose Language");
		chooseLanguageState.hideDialog = function () {
			hideDialog(this.messageId, this.dialogId);
		};
		chooseLanguageState.setMessageId = function (messageId, dialogId) {
			this.messageId = messageId;
			this.dialogId = dialogId;
		};
		chooseLanguageState.init = function() {
			var languageState = this;

			//show dialog with languages
			var dialogActions = [
				{command: "english", description: "english language"},
				{command: "german", description: "deutsche Sprache"},
				{command: "spanish", description: "idioma español"},
				{command: "french", description: "langue française"},
				{command: "turkish", description: "türk dili"},
				{command: "russian", description: "русский язык"}
			];
			showDialog("Choose a Language", "", "Say a language:", dialogActions, function (ids) {
				languageState.setMessageId(ids.messageId, ids.dialogId);
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
				hideMessage(this.messageId);
			};
			sayParameterState.setMessageId = function (messageId) {
				this.messageId = messageId;
			};
			sayParameterState.init = function() {
				var sayParamState = this;

				var paramText = "say your parameter in chosen language";
				if (settings.length >= 1) {
					var pos = parameterNumber - 1;
					if (settings[pos].hasOwnProperty("notify") && settings[pos].notify != "") {
						paramText = settings[pos].notify;
					}

					if (settings[pos].hasOwnProperty("say") && settings[pos].say != "") {
						say(settings[pos].say);
					}
				}
				notify(paramText, 0, function(messageId) {
					sayParamState.setMessageId(messageId);
				});
				this.ableToCancel = false;
				this.ableToMute = false;
			};

			var sayParameterAction = new Action("Say Parameter", 1, null);
			sayParameterAction.addCommand(new Command("(.+)", 1));
			sayParameterAction.sayParameterState = sayParameterState;
			sayParameterAction.act = function(args) {
				this.sayParameterState.hideDialog();
				var actualParams = (typeof spokenParameter === 'undefined') ? [] : spokenParameter;
				actualParams.push(args[0]);
				if (parameterNumber < that.relatedAction.parameterCount) {
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.followingState = generateStatesAndActions(parameterNumber + 1, actualParams);
				} else {
					//only act the related action after last parameter
					that.relatedAction.act(actualParams);
					//action can change the following state
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.followingState = that.relatedAction.followingState;
				}
			};
			sayParameterState.addAction(sayParameterAction);

			this.followingState = sayParameterState;
		};
		chooseLanguageState.addAction(chooseLanguageAction);
		return chooseLanguageState;
	}

	// Call the parent constructor
	Action.call(this, name, 0, generateStatesAndActions(1));
}