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
		var chooseLanguageState = new State("chooseLanguageState");
		chooseLanguageState.hideDialog = function () {
			hideDialog(this.messageId, this.dialogId);
		};
		chooseLanguageState.setMessageId = function (messageId, dialogId) {
			this.messageId = messageId;
			this.dialogId = dialogId;
		};

		chooseLanguageState.init = function() {
			this.accessibleWithCancelAction = false;

			//create choose language action
			var chooseLanguageAction = new Action("chooseLanguage", 1, null);
			chooseLanguageAction.chooseLanguageState = this;
			chooseLanguageAction.act = function(arguments) {
				this.chooseLanguageState.hideDialog();

				var lang;
				switch(arguments[0].toLowerCase()) {
					case translate("english"): lang = "en"; break;
					case translate("german"): lang = "de"; break;
					case translate("spanish"): lang = "es"; break;
					case translate("french"): lang = "fr"; break;
					case translate("turkish"): lang = "tr"; break;
					case translate("russian"): lang = "ru"; break;
					default: lang = "en"
				}
				//create following state and action
				var sayParameterState = new State("sayParameterState");
				sayParameterState.lang = lang;
				sayParameterState.hideDialog = function () {
					hideMessage(this.messageId);
				};
				sayParameterState.setMessageId = function (messageId) {
					this.messageId = messageId;
				};
				sayParameterState.init = function() {
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.accessibleWithCancelAction = false;
					this.ableToCancel = false;
					this.ableToMute = false;
				};
				sayParameterState.runAtEntrance = function() {
					var sayParamState = this;

					var paramText = translate("sayParameterInLanguage");
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
				};

				var sayParameterAction = new Action("sayParameter", 1, null);
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
			this.addAction(chooseLanguageAction);
		};
		chooseLanguageState.runAtEntrance = function() {
			var languageState = this;
			//show dialog with languages
			var dialogActions = [
				{command: translate("english"), description: "english language"},
				{command: translate("german"), description: "deutsche Sprache"},
				{command: translate("spanish"), description: "idioma español"},
				{command: translate("french"), description: "langue française"},
				{command: translate("turkish"), description: "türk dili"},
				{command: translate("russian"), description: "русский язык"}
			];
			showDialog(translate("chooseLanguage"), "", translate("sayLanguage") + ":", dialogActions, function (ids) {
				languageState.setMessageId(ids.messageId, ids.dialogId);
			});
			//close dialog at cancel
			this.cancelAction.cancelAct = function() {
				languageState.hideDialog();
			};
		};

		return chooseLanguageState;
	}

	// Call the parent constructor
	Action.call(this, name, 0, generateStatesAndActions(this.relatedAction.parameterCount));
}