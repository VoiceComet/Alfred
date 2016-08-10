/**
 * State
 * @param {String} name
 * @constructor
 */
function State (name) {
    this.name = name;
    this.actions = [];

	this.muted = false;
	this.hearing = false;
	this.working = false;

	this.recognition = null;
	this.recognizing = true;
	this.continuous = false;
	this.interimResults = false;
	this.maxAlternatives = 20;
	this.lang = 'en';
	
	//standard actions
	this.ableToMute = true;
	this.muteActionIn = null;
	this.muteActionOut = null;
	this.muteState = null;
	this.ableToCancel = true;
	this.cancelAction = null;

	/**
	 * add an action to this state
	 * @param {Action} action
	 */
    this.addAction = function(action) {
        this.actions.push(action);
    };

	/**
	 * generate standard actions
	 */
	this.generateStandardActions = function() {
		//mute
		if (this.muteState == null) {
			this.muteState = new State("MuteState of " + this.name);
			var that = this;
			this.muteState.init = function() {
				//mute state after creation
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.muted = true;
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.ableToMute = false;
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.ableToCancel = false;
				notify('mute, say "listen"');
			};
			this.muteActionIn = new Action("Mute Action", 0, this.muteState);
			this.muteActionIn.addCommand(new Command("mute", 0));
			this.muteActionIn.addCommand(new Command("don't listen", 0));
			this.muteActionIn.act = function() {
				//mute state
				that.muted = true;
				that.updateMicrophoneIcon();
			};
			this.muteActionOut = new Action("Mute Action", 0, this);
			this.muteActionOut.addCommand(new Command("listen", 0));
			this.muteActionOut.act = function() {
				notify("demuted");
				that.muteState.muted = false;
				that.muted = false;
				that.updateMicrophoneIcon();
			};
			this.muteState.addAction(this.muteActionOut);
		}
		
		//abort
		if (this.cancelAction == null) {
			this.cancelAction = new Action("Cancel Action", 0, globalCommonState);
			this.cancelAction.addCommand(new Command("cancel", 0));
			this.cancelAction.act = function() {
				notify("cancel");
			}
		}
	};

	/**
	 * activate standard actions
	 */
	this.activateStandardActions = function() {
		if (this.ableToMute) {
			this.addAction(this.muteActionIn);
		}
		
		if (this.ableToCancel) {
			this.addAction(this.cancelAction);
		}
	};

	/**
	 * Initialize this state. This method is called in the run method after the activation of the state.
	 * You can override this function and add actions to this state
	 *
	 * You can set the variables: this.ableToMute, this.ableToCancel
	 * to enable or disable standard actions.
	 */
	this.init = function() {};

	/**
	 * Run the state. This method is called when the state is activated.
	 */
    this.run = function() {
		this.generateStandardActions();
		this.init();
		this.activateStandardActions();
		this.startSpeechRecognition();
    };

	/**
	 * update Icon on front page
	 */
	this.updateMicrophoneIcon = function() {
		callContentScriptMethod("updateMicrophoneIcon", {muted:this.muted, hearing:this.hearing, working:this.working});
	};

	/**
	 * change the active state
	 * @param state
	 */
	this.changeActiveState = function (state) {
		this.stopSpeechRecognition();
		//change state or start new speech recognition
		if (state != this) {
			changeActiveState(state);
		} else {
			this.startSpeechRecognition();
		}
	};

	/**
	 * Analyse the speech alternatives after a result of the speech recognition.
	 * It runs throw all commands of all actions of this state and check if some commands are called.
	 *
	 * You can override this function.
	 *
	 * @param {[String]} alternatives
	 */
	this.analyseRecognitionResult = function(alternatives) {
		/**
		 * simple Hit object
		 * @param {Array} execResult
		 * @param {Number} alternativeIndex
		 * @constructor
		 */
		function Hit(execResult, alternativeIndex) {
			/** @type {Array} */
			this.execResult = execResult;
			/** @type {Number} */
			this.alternativeIndex = alternativeIndex;
			/** @type {Number} */
			this.textLengthWeight = execResult[0].length / execResult['input'].length;
		}
		/**
		 * simple ActionHit object
		 * @param {Action} action
		 * @constructor
		 */
		function ActionHit(action) {
			/** @type {Action} */
			this.action = action;
			/** @type {Array} */
			this.hits = [];
		}

		/**
		 * run action of hit
		 * @param {ActionHit} actionHit
		 * @param {Number} [hit=0]
		 */
		function runHitAction(actionHit, hit) {
			hit = (typeof hit !== 'undefined') ? hit : 0; //set default value to 3000
			var arguments = [];
			for (var i = 1;  i <= actionHit.action.parameterCount; i++) {
				arguments[i-1] = actionHit.hits[hit].execResult[i].trim();
			}
			actionHit.action.act(arguments);
		}
		
		var actionHits = [];
		var actionHitsIndex = 0;
		
		//all actions
		var i;
		var j;
		for (i = 0; i < this.actions.length; i++) {
			//all commands of action
			for (j = 0; j < this.actions[i].commands.length; j++) {
				var actionAdded = false;
				//all alternatives
				for (var k = 0; k < alternatives.length; k++) {
					alternatives[k] = alternatives[k].trim(); //delete spaces at string beginning and ending
					//test the regular expression
					var execResult = this.actions[i].commands[j].expression.exec(alternatives[k]);
					if (execResult != null) {
						//result found
						if (!actionAdded) {
							//add to actionHits array
							actionHits[actionHitsIndex] = new ActionHit(this.actions[i]);
							actionAdded = true;
						}
						//add hit to actionHit
						actionHits[actionHitsIndex].hits.push(new Hit(execResult, k));
						
						//text not the same than found expression
						if (this.actions[i].parameterCount == 0 && execResult[0] == alternatives[k]) {
							//perfect text match
							runHitAction(actionHits[actionHitsIndex]);
							this.changeActiveState(actionHits[actionHitsIndex].action.followingState);
							return;
						}
					}
				}
				
				//increment index for each added action
				if (actionAdded) actionHitsIndex++;
			}
		}

		if (actionHits.length > 0) {
			if (actionHits.length == 1) {
				//only one action found
				runHitAction(actionHits[0]); //run first actionHit
				this.changeActiveState(actionHits[0].action.followingState);
				//return;
			} else {
				//no perfect match
				//filter hits
				for (i = 0; i < actionHits.length; i++) {
					//noinspection JSUnusedLocalSymbols
					actionHits[i].hits = actionHits[i].hits.filter(function(element, index, array) {
						//best text length weight of one alternative
						for (j = 0; j < actionHits.length; j++) {
							if (j == i) continue;
							//noinspection JSUnusedLocalSymbols
							var result = actionHits[j].hits.find(function (ele, ind, arr) {
								return ele.alternativeIndex == element.alternativeIndex
							});
							if (typeof result !== 'undefined') {
								return element.textLengthWeight >= result.textLengthWeight;
							}
						}
						return true;
					});
				}
				//noinspection JSUnusedLocalSymbols
				actionHits = actionHits.filter(function(element, index, array) {
					return element.hits.length > 0;
				});


				if (actionHits.length == 1) {
					//only one action found
					runHitAction(actionHits[0]); //run first actionHit
					this.changeActiveState(actionHits[0].action.followingState);
					return;
				}

				//ask user
				var dialogActionNumber = 1;
				var dialogActions = [];

				var dialogState = new State("DialogState");


				dialogState.hideDialog = function () {
					//noinspection JSPotentiallyInvalidUsageOfThis
					hideDialog(this.messageId);
				};
				dialogState.setMessageId = function (messageId) {
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.messageId = messageId;
				};

				for (i = 0; i < actionHits.length; i++) {
					for (j = 0; j < actionHits[i].hits.length; j++) {
						dialogActions.push({
							command: dialogActionNumber,
							description: actionHits[i].action.name + ": " + alternatives[actionHits[i].hits[j].alternativeIndex] + " (" +
									actionHits[i].hits[j].alternativeIndex + " " + Number((actionHits[i].hits[j].textLengthWeight).toFixed(2)) + ")"
						});
						//create dialog action
						var action = new Action("Dialog Action " + dialogActionNumber, 0, actionHits[i].action.followingState);
						action.actionHit = actionHits[i];
						action.hit = j;
						action.dialogState = dialogState;
						action.addCommand(new Command(dialogActionNumber+'', 0));
						//noinspection JSUnusedLocalSymbols
						action.act = function (arguments) {
							runHitAction(this.actionHit, this.hit);
							this.dialogState.hideDialog();
						};
						dialogState.addAction(action);
						dialogActionNumber++;
					}
				}

				this.changeActiveState(dialogState);

				showDialog('What did you say?', actionHits.length + " Actions were found.", dialogActions, function(messageId) {
					dialogState.setMessageId(messageId);
				});
			}
		} else {
			//not found
			notify('I cannot find the command "' + alternatives[0] + '". Please repeat.');
		}
	};

	/**
	 * create a speech recognition object and start the recognition
	 */
	this.createWebkitSpeechRecognition = function() {
		var that = this;

		this.recognition = new webkitSpeechRecognition();
		this.recognition.continuous = this.continuous;
		this.recognition.interimResults = this.interimResults; //true: is faster, but you get more answers per speech
		this.recognition.maxAlternatives = this.maxAlternatives;
		this.recognition.lang = this.lang; //TODO: selectable language? de-DE

		//noinspection SpellCheckingInspection
		this.recognition.onresult = function(event) {
			that.hearing = false;
			that.working = true;
			that.updateMicrophoneIcon();

			var alternatives = [];
			for (var i = event.resultIndex; i < event.results.length; i++) {
				//all alternatives
				for (var j = 0; j < event.results[i].length; j++) {
					if (j in alternatives) {
						alternatives[j] += event.results[i][j].transcript;
					} else {
						alternatives[j] = event.results[i][j].transcript;
					}
				}
			}

			that.analyseRecognitionResult(alternatives);
			that.working = false;
			that.updateMicrophoneIcon();
		};


		//noinspection SpellCheckingInspection
		this.recognition.onsoundstart = function() {
			that.hearing = true;
			that.updateMicrophoneIcon();
		};

		//noinspection SpellCheckingInspection
		this.recognition.onsoundstop = function() {
			that.hearing = false;
			that.updateMicrophoneIcon();
		};

		//noinspection SpellCheckingInspection
		this.recognition.onnomatch = function(event) {
			//alert("onnomatch");
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				alert("no match: " + event.results[i][0].transcript);
			}
		};

		//noinspection SpellCheckingInspection
		this.recognition.onerror = function(event) {
			that.hearing = false;
			that.updateMicrophoneIcon();
			//alert("onerror");
			if (event.error == "not-allowed") {
				//get permission
				if (permissionGrounded) {
					chrome.tabs.create({url: chrome.extension.getURL("getPermission.html")});				
				}
				permissionGrounded = false;
			} else if (event.error == "network") {
				console.log(event.error + ": " + event.message);
				notify("Network Error. Please check your network connection.");
			} else {
				if (event.error != "no-speech") {
					console.log(event.error + ": " + event.message);
				}
			}
		};

		//noinspection JSUnusedLocalSymbols,SpellCheckingInspection
		this.recognition.onend = function(event) {
			that.hearing = false;
			that.updateMicrophoneIcon();
			//alert("onend");
			that.startSpeechRecognition();
		};
		
		this.recognition.start();
	};

	/**
	 * start the speech recognition
	 */
	this.startSpeechRecognition = function() {
		if (this.recognizing) {
			this.createWebkitSpeechRecognition();
		}
	};

	/**
	 * stop the speech recognition
	 */
	this.stopSpeechRecognition = function() {
		//override onEnd and onError function to suppress restart at fast switching of this.recognizing
		//noinspection SpellCheckingInspection
		this.recognition.onerror = function(event) {};
		//noinspection SpellCheckingInspection
		this.recognition.onend = function(event) {};
		this.recognition.stop();
	};
}