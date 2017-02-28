/**
 * A SpeechRecognitionControl is a class which has control functions for the speech recognition
 * @constructor
 */
function SpeechRecognitionControl () {

	//settings for webkitSpeechRecognition objects
	this.continuous = false;
	this.interimResults = false;
	this.maxAlternatives = 20;

	/**
	 * @type {boolean}
	 * @private
	 */
	this.muted = false;
	/**
	 * @type {boolean}
	 * @private
	 */
	this.hearing = false;
	/**
	 * @type {boolean}
	 * @private
	 */
	this.working = false;
	/**
	 * @type {boolean}
	 * @private
	 */
	this.backgroundWorking = false;
	/**
	 * @type {boolean}
	 * @private
	 */
	this.recognizing = true;
	/**
	 * @type {boolean}
	 * @private
	 */
	this.saying = false;
	/**
	 * @type {SpeechRecognition}
	 * @private
	 */
	this.activeRecognition = null;
	/**
	 * @type {SpeechRecognition}
	 * @private
	 */
	this.nextRecognition = null;

	/**
	 * sets hearing value and updates icon
	 * @private
	 */
	this.setHearing = function(value) {
		this.hearing = value;
		this.updateMicrophoneIcon();
	};

	/**
	 * sets muted value and updates icon
	 * @private
	 */
	this.setMuted = function(value) {
		this.muted = value;
		this.updateMicrophoneIcon();
	};

	/**
	 * sets working value and updates icon
	 * @private
	 */
	this.setWorking = function(value) {
		this.working = value;
		this.updateMicrophoneIcon();
	};

	/**
	 * sets background working value and updates icon
	 * @private
	 */
	this.setBackgroundWorking = function(value) {
		this.backgroundWorking = value;
		this.updateMicrophoneIcon();
	};

	/**
	 * sets recognizing value and for influencing the speech recognition
	 */
	this.switchRecognizing = function() {
		this.recognizing = !this.recognizing;
		if (this.recognizing) {
			//start recognition
			this.startSpeechRecognition();
			//change icon
			chrome.browserAction.setIcon({path:"../images/mic_on.png"});
		} else {
			//stop recognition
			this.stopSpeechRecognition();
			//change icon
			chrome.browserAction.setIcon({path:"../images/mic_off.png"});
		}
	};

	/**
	 * sets saying value and for influencing the speech recognition
	 */
	this.setSaying = function(value) {
		this.saying = value;
		this.updateMicrophoneIcon();
		if (this.saying) {
			this.stopSpeechRecognition();
		} else {
			this.startSpeechRecognition();
		}
	};


	/**
	 * creates and returns a speech recognition object
	 * @return {SpeechRecognition} object
	 * @private
	 */
	this.createWebkitSpeechRecognition = function() {
		var that = this;

		var recognition = new webkitSpeechRecognition();
		recognition.continuous = this.continuous;
		recognition.interimResults = this.interimResults; //true: is faster, but you get more answers per speech
		recognition.maxAlternatives = this.maxAlternatives;
		recognition.networkError = false;

		//noinspection SpellCheckingInspection
		recognition.onresult = function(event) {
			that.setHearing(false);
			that.setBackgroundWorking(true);

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

			console.debug("speech recognition found result", alternatives);
			that.analyseRecognitionResult(alternatives, confidence);
			that.setBackgroundWorking(false);
		};


		//noinspection SpellCheckingInspection
		recognition.onsoundstart = function() {
			that.setHearing(true);
		};

		//noinspection SpellCheckingInspection
		recognition.onsoundstop = function() {
			that.setHearing(false);
		};

		//noinspection SpellCheckingInspection
		recognition.onnomatch = function(event) {
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				console.warn("speech recognition found no match", event.results[i][0].transcript);
			}
		};

		//noinspection SpellCheckingInspection
		recognition.onerror = function(event) {
			that.setHearing(false);
			//alert("onerror");
			if (event.error == "not-allowed") {
				//get permission
				if (permissionGrounded) {
					chrome.tabs.create({url: chrome.extension.getURL("getPermission.html")});
				}
				permissionGrounded = false;
			} else if (event.error == "network") {
				this.networkError = true;
				console.warn(event.error, event.message);
				notify(translate("networkError"), 3000);
			} else {
				if (event.error != "no-speech") {
					console.error(event.error, event.message);
				}
			}
		};

		//noinspection JSUnusedLocalSymbols,SpellCheckingInspection
		recognition.onend = function(event) {
			that.stopSpeechRecognition();
			that.setHearing(false);

			//if there was a network error, wait until message box is away before restart
			if (this.networkError) {
				setTimeout(function() {
					that.startSpeechRecognition();
				}, 3000)
			} else {
				that.startSpeechRecognition();
			}
		};

		return recognition;
	};
	this.nextRecognition = this.createWebkitSpeechRecognition();

	/**
	 * creates and returns a speech recognition object
	 * @return {SpeechRecognition} object
	 * @private
	 */
	this.getNextSpeechRecognition = function() {
		//wait for setting new recognition object
		while (this.nextRecognition == null) {} //TODO maybe with flags?
		//get next recognition object
		var nextRecognition = this.nextRecognition;
		//set it to null
		this.nextRecognition = null;
		//async setting of new recognition object
		var that = this;
		setTimeout(function() {
			that.nextRecognition = that.createWebkitSpeechRecognition();
		}, 0);

		return nextRecognition;
	};

	/**
	 * start the speech recognition
	 */
	this.startSpeechRecognition = function() {
		//here were timing problems
		if (this.recognizing) {
			if (this.activeRecognition == null) {
				if (!this.saying) {
					var lang = (activeState.lang == null) ? language : activeState.lang;
					this.activeRecognition = this.getNextSpeechRecognition();
					this.activeRecognition.lang = lang;
					this.activeRecognition.start();
					console.debug("speech recognition started", "language = " + lang);
				} else {
					console.debug("saying something delays speech recognition start");
				}
			} else {
				console.debug("speech recognition already started");
			}
		} else {
			console.debug("speech recognition cannot start, recognizing is disabled");
		}

	};

	/**
	 * stop the speech recognition
	 */
	this.stopSpeechRecognition = function() {
		if (this.activeRecognition != null) {
			//override onEnd and onError function to suppress restart at fast switching of this.recognizing
			//noinspection SpellCheckingInspection
			this.activeRecognition.onerror = function(event) {};
			//noinspection SpellCheckingInspection
			this.activeRecognition.onend = function(event) {};
			this.activeRecognition.stop();
			this.activeRecognition = null;
			console.debug("speech recognition stopped");
		} else {
			console.debug("speech recognition already stopped");
		}
	};

	/**
	 * simple Hit object
	 * @param {Array} alternatives - alternatives of recognition result
	 * @param {Number} confidence - confidence of recognition result
	 * @param {Array} execResult
	 * @param {Number} alternativeIndex
	 * @constructor
	 * @private
	 */
	function Hit(alternatives, confidence, execResult, alternativeIndex) {
		/** @type {Array} */
		this.execResult = execResult;
		/** @type {Number} */
		this.alternativeIndex = alternativeIndex;
		/** @type {Number} */
		this.confidence = confidence;
		/** @type {Array} */
		this.alternatives = alternatives;

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
			var confidenceWeight = this.confidence / this.alternatives.length * (this.alternatives.length-this.alternativeIndex);

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
			//console.debug("confidenceWeight: " + confidenceWeight + " textLengthWeight: " + textLengthWeight + " parameterPositionWeight: " + parameterPositionWeight);

			this.weight = confidenceWeight * 0.4 + textLengthWeight * 0.4 + parameterPositionWeight * 0.2;
			return this.weight;
		};
		//console.debug(alternativeIndex + ": " + this.execResult['input'] + " || " + this.execResult[0] + " || " + this.getWeight());
	}

	/**
	 * simple ActionHit object
	 * @param {Action} action
	 * @constructor
	 * @private
	 */
	function ActionHit(action) {
		/** @type {Action} */
		this.action = action;
		/** @type {Array} */
		this.hits = [];
	}

	/**
	 * Analyse the speech alternatives after a result of the speech recognition.
	 * It runs throw all commands of all actions of this state and check if some commands are called.
	 *
	 * You can override this function.
	 *
	 * @param {[String]} alternatives
	 * @param {Number} confidence
	 * @private
	 */
	this.analyseRecognitionResult = function(alternatives, confidence) {
		/**
		 * run action of hit
		 * @param {ActionHit} actionHit
		 * @param {Number} [hit=0]
		 */
		function runHitAction(actionHit, hit) {
			hit = (typeof hit !== 'undefined') ? hit : 0; //set default value to 0
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
		var state = activeState;
		for (i = 0; i < state.actions.length; i++) {
			if (state.actions[i].module != null && !state.actions[i].module.active) {
				//skip actions of inactive modules
				continue;
			}
			var actionAdded = false;
			//all commands of action
			var actionCommands = state.actions[i].getCommands();
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
							actionHits[actionHitsIndex] = new ActionHit(state.actions[i]);
							actionAdded = true;
						}
						//add hit to actionHit
						actionHits[actionHitsIndex].hits.push(new Hit(alternatives, confidence, execResult, k));

						//text not the same than found expression
						if (state.actions[i].parameterCount == 0 && execResult[0] == alternatives[k]) {
							//perfect text match
							runHitAction(actionHits[actionHitsIndex]);
							state.changeActiveState(actionHits[actionHitsIndex].action.followingState, actionHits[actionHitsIndex].action != state.cancelAction);
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
				state.changeActiveState(actionHits[0].action.followingState, actionHits[0].action != state.cancelAction);
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
										if (newHitList[newHitListId].execResult[paramId].toLowerCase() != actionHits[i].hits[hitId].execResult[paramId].toLowerCase()) {
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
					state.changeActiveState(actionHits[0].action.followingState, actionHits[0].action != state.cancelAction);
					return;
				}

				//if muted, don't show messages
				if (state.muted) {
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
					this.cancelAction.cancelAct = function(arguments) {
						this.dialogState.hideDialog(this.messageId);
					};
				};

				for (i = 0; i < actionHits.length; i++) {
					for (j = 0; j < actionHits[i].hits.length; j++) {
						var dialogAction = {
							command: dialogActionNumber,
							description: actionHits[i].action.getName()
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
						action.loadLanguageCommands = false;
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

				state.changeActiveState(dialogState);

				showDialog("&nbsp;", translate("whatCanIDoForYou"), translate("sayANumber") + ":", dialogActions, function(ids) {
					dialogState.setMessageId(ids.messageId, ids.dialogId);
				});
				say(translate("whatCanIDoForYou"));
			}
		} else {
			//not found
			if (!state.muted) {
				notify(translate("IDontKnowWhatYouMeanWith").format([alternatives[0]]));
				say(translate("PleaseRepeatYourWish"));
			}
		}
	};

	/**
	 * update Icon on front page
	 * @private
	 */
	this.updateMicrophoneIcon = function() {
		var working = this.working || this.backgroundWorking || this.saying;
		callContentScriptMethod("updateMicrophoneIcon", {muted:this.muted, hearing:this.hearing, working:working}, null, false);
	};

}