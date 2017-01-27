/**
 * State
 * @param {String} internalName
 * @constructor
 */
function State (internalName) {
    this.internalName = internalName;
	this.oldState = globalCommonState;
    this.actions = [];
	/** @private */
	this.initialized = false;
	this.accessibleWithCancelAction = true;

	this.muted = false;
	this.hearing = false;
	this.working = false;

	this.recognition = null;
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
	 * get translated name of state
	 * @return {String} name
	 */
	this.getName = function() {
		return getStateTranslation(this.internalName)
	};

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
			this.muteState = new State("muteState");
			var that = this;
			this.muteState.init = function() {
				//mute state after creation
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.muted = true;
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.ableToMute = false;
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.ableToCancel = false;
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.accessibleWithCancelAction = false;
				notify('muted, say "Hello ' + butlerName + '" or "' + butlerName + ' listen"');
			};
			this.muteActionIn = new Action("muteEnable", 0, this.muteState);
			this.muteActionIn.act = function() {
				//mute state
				that.muted = true;
				that.updateMicrophoneIcon();
			};
			this.muteActionOut = new Action("muteDisable", 1, this);
			this.muteActionOut.act = function(parameter) {
				if (parameter[0] == butlerName) {
					notify("Welcome back");
					say("Welcome back");
					that.muteState.muted = false;
					that.muted = false;
					that.updateMicrophoneIcon();
					//switch to un muted state
					this.followingState = that;
				} else {
					//stay in mute state
					this.followingState = that.muteState;
				}
			};
			this.muteState.addAction(this.muteActionOut);
		}
		
		//abort
		if (this.cancelAction == null) {
			this.cancelAction = new Action("cancel", 0, null);
			//can be override
			this.cancelAction.cancelAct = function() {};
			this.cancelAction.act = function() {
				this.followingState = getNextCancelState();
				this.cancelAct();
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
	 * Initialize this state. This method is called in the run method for initialization of the state.
	 * It runs only at the first time of entrance to this state
	 * You can override this function and add actions to this state
	 *
	 * You can set the variables: this.ableToMute, this.ableToCancel
	 * to enable or disable standard actions.
	 */
	this.init = function() {};

	/**
	 * This method runs after every entrance to this state
	 * You can override this function and add procedures
	 */
	this.runAtEntrance = function() {};

	/**
	 * Run the state. This method is called when the state is activated.
	 * @param {State} oldState
	 */
    this.run = function(oldState) {
		this.oldState = oldState;
		if (!this.initialized) {
			this.generateStandardActions();
			this.init();
			this.activateStandardActions();
			this.initialized = true;
		}
		this.runAtEntrance();
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
	 * @param {State} state
	 * @param {Boolean} [cancelStack=true] - true, if the cancel stack should be filled
	 */
	this.changeActiveState = function (state, cancelStack) {
		this.stopSpeechRecognition();
		//change state or start new speech recognition
		if (state != this) {
			changeActiveState(state, (typeof cancelStack === 'undefined' || cancelStack === true));
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
	 * @param {Number} confidence
	 */
	this.analyseRecognitionResult = function(alternatives, confidence) {
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

			/**
			 * @type {Number}
			 * @private
			 */
			this.weight = -1;

			/**
			 * calculate weight of this hit
			 * @return {Number}
			 */
			this.getWeight = function() {
				if (this.weight >= 0) {
					return this.weight;
				}
				//evaluate confidence weight
				/** @type {Number} */
				var confidenceWeight = confidence / alternatives.length * (alternatives.length-this.alternativeIndex);

				//evaluate text length weight
				/** @type {Number} */
				var textLengthWeight = this.execResult[0].length / this.execResult['input'].length;

				//evaluate parameter position weight
				function isSubStringAtBorder(subString) {
					var index = execResult[0].indexOf(subString);
					return (index <= 0 || index + subString.length >= execResult[0].length);
				}
				//for each parameter
				var weight = 0;
				var i = 1;
				while (this.execResult.hasOwnProperty(i + "")) {
					if (!isSubStringAtBorder(this.execResult[i])) {
						weight += 1;
					}
					i++;
				}
				/** @type {Number} */
				var parameterPositionWeight = (i <= 1) ? 1 : weight / (i-1);
				//console.log("confidenceWeight: " + confidenceWeight + " textLengthWeight: " + textLengthWeight + " parameterPositionWeight: " + parameterPositionWeight);

				this.weight = confidenceWeight * 0.4 + textLengthWeight * 0.4 + parameterPositionWeight * 0.2;
				return this.weight;
			};
			//console.log(alternativeIndex + ": " + this.execResult['input'] + " || " + this.execResult[0] + " || " + this.getWeight());
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
			if (this.actions[i].module != null && !this.actions[i].module.active) {
				//skip actions of inactive modules
				continue;
			}
			var actionAdded = false;
			//all commands of action
			var actionCommands = this.actions[i].getCommands();
			for (j = 0; j < actionCommands.length; j++) {
				//all alternatives
				for (var k = 0; k < alternatives.length; k++) {
					alternatives[k] = alternatives[k].trim(); //delete spaces at string beginning and ending
					//test the regular expression
					var execResult = actionCommands[j].getRegExp().exec(alternatives[k]);
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
							this.changeActiveState(actionHits[actionHitsIndex].action.followingState, actionHits[actionHitsIndex].action != this.cancelAction);
							return;
						}
					}
				}
			}
			//increment index for each added action
			if (actionAdded) actionHitsIndex++;
		}

		if (actionHits.length > 0) {
			if (actionHits.length == 1 && actionHits[0].hits.length == 1) {
				//only one action and hit found
				runHitAction(actionHits[0]); //run first actionHit
				this.changeActiveState(actionHits[0].action.followingState, actionHits[0].action != this.cancelAction);
				//return;
			} else {
				//no perfect match
				var bestActionHitWeight = 0;
				//filter hits
				for (i = 0; i < actionHits.length; i++) {
					//sort hits of actionHit
					actionHits[i].hits = actionHits[i].hits.sort(function(a, b) {
						return b.getWeight() - a.getWeight();
					});

					if (actionHits[i].hits.length > 0) {
						if (actionHits[i].action.parameterCount <= 0) {
							//actions without parameters should only have one hit
							actionHits[i].hits = [actionHits[i].hits[0]];
						} else {
							//combine hits with same parameters of actions with one or more parameters
							var newHitList = [];
							for (var hitId = 0; hitId < actionHits[i].hits.length; hitId++) {
								var putInNewHitList = true;
								for (var newHitListId = 0; newHitListId < newHitList.length; newHitListId++) {
									var sameParameters = true;
									//check parameters are equal
									for (var paramId = 1; paramId <= actionHits[i].action.parameterCount; paramId++) {
										if (newHitList[newHitListId].execResult[paramId] != actionHits[i].hits[hitId].execResult[paramId]) {
											sameParameters = false;
											break;
										}
									}
									if (sameParameters) {
										//a better hit is already in the list
										putInNewHitList = false;
										break;
									}
								}
								if (putInNewHitList) {
									newHitList.push(actionHits[i].hits[hitId]);
								}
							}
							actionHits[i].hits = newHitList;
						}
					}

					//get best weight
					var bestWeight = actionHits[i].hits[0].getWeight();
					if (bestActionHitWeight < bestWeight) {
						bestActionHitWeight = bestWeight;
					}
				}

				//need of bestActionHitWeight
				for (i = 0; i < actionHits.length; i++) {
					//filter too small weights
					actionHits[i].hits = actionHits[i].hits.filter(function(element) {
						return element.getWeight() >= bestActionHitWeight * 0.92;
					});

					//cut hits array
					var maxHitsPerAction = 5;
					if (actionHits[i].hits.length > maxHitsPerAction) {
						actionHits[i].hits = actionHits[i].hits.slice(0, maxHitsPerAction);
					}
				}

				//noinspection JSUnusedLocalSymbols
				actionHits = actionHits.filter(function(element, index, array) {
					return element.hits.length > 0;
				});

				if (actionHits.length == 1 && actionHits[0].hits.length == 1) {
					//only one action found
					runHitAction(actionHits[0]); //run first actionHit
					this.changeActiveState(actionHits[0].action.followingState, actionHits[0].action != this.cancelAction);
					return;
				}

				//if muted, don't show messages
				if (this.muted) {
					return;
				}

				//ask user
				var dialogActionNumber = 1;
				var dialogActions = [];

				var dialogState = new State("DialogState");


				dialogState.hideDialog = function () {
					//noinspection JSPotentiallyInvalidUsageOfThis
					hideDialog(this.messageId, this.dialogId);
				};
				dialogState.setMessageId = function (messageId, dialogId) {
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.messageId = messageId;
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.dialogId = dialogId;
				};

				// modify cancel action
				dialogState.init = function() {
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.accessibleWithCancelAction = false;
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.cancelAction.dialogState = this;
					//noinspection JSPotentiallyInvalidUsageOfThis,JSUnusedLocalSymbols
					this.cancelAction.act = function(arguments) {
						this.dialogState.hideDialog(this.messageId);
					};
				};

				for (i = 0; i < actionHits.length; i++) {
					for (j = 0; j < actionHits[i].hits.length; j++) {
						var dialogAction = {
							command: dialogActionNumber,
							description: actionHits[i].action.name
						};
						for (k = 0; k < actionHits[i].action.parameterCount; k++) {
							var before = (k == 0) ? ": " : ", ";
							dialogAction.description += before + actionHits[i].hits[j].execResult[k+1];
						}
						dialogActions.push(dialogAction);

						//create dialog action
						var action = new Action("Dialog Action " + dialogActionNumber, 0, actionHits[i].action.followingState);
						action.actionHit = actionHits[i];
						action.hit = j;
						action.dialogState = dialogState;
						//TODO add command should work
						action.addCommand(new Command(dialogActionNumber+'', 0));
						//noinspection JSUnusedLocalSymbols
						action.act = function (arguments) {
							runHitAction(this.actionHit, this.hit);
							//for generated following states
							if (this.followingState == null) {
								this.followingState = this.actionHit.action.followingState;
							}
							this.dialogState.hideDialog();
						};
						dialogState.addAction(action);
						dialogActionNumber++;
					}
				}

				this.changeActiveState(dialogState);

				showDialog("&nbsp;", "What can I do for you?", "Say a number:", dialogActions, function(ids) {
					dialogState.setMessageId(ids.messageId, ids.dialogId);
				});
				say('What can I do for you?');
			}
		} else {
			//not found
			if (!this.muted) {
				notify('I don\'t know what you mean with "' + alternatives[0] + '".');
				say('Please, repeat your wish');
			}
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
		this.recognition.lang = this.lang;
		this.recognition.networkError = false;
		this.recognition.hearingTab = activeTab;

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
			//only get the first confidence, because all other alternatives have a confidence of 0
			var confidence = (alternatives.length > 0) ? event.results[event.resultIndex][0].confidence : 0;
			if (confidence <= 0) {
				confidence = 0.8; //std confidence when webspeech api fails with confidence caused by bug
			}

			that.analyseRecognitionResult(alternatives, confidence);
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
				that.recognition.networkError = true;
				console.log(event.error + ": " + event.message);
				notify("Network Error. Please check your network connection.", 3000);
			} else {
				if (event.error != "no-speech") {
					console.log(event.error + ": " + event.message);
				}
			}
		};

		//noinspection JSUnusedLocalSymbols,SpellCheckingInspection
		this.recognition.onend = function(event) {
			//alert("onend");
			that.hearing = false;
			that.updateMicrophoneIcon();

			//if there was a network error, wait until message box is away before restart
			if (that.recognition.networkError) {
				setTimeout(function() {
					that.startSpeechRecognition();
				}, 3000)
			} else {
				//check if the active tab is the same as the tab at creation
				if (activeTab == this.hearingTab) {
					that.startSpeechRecognition();
				}
			}
		};
		
		this.recognition.start();
	};

	/**
	 * start the speech recognition
	 */
	this.startSpeechRecognition = function() {
		if (recognizing) {
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