/**
 * name: str, name of state
*/
function State (name) {
    this.name = name;
    this.actions = [];
	
	this.recognition = null;
	this.recognizing = true;
	this.continuous = false;
	this.interimResults = false;
	this.maxAlternatives = 10;
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
			this.muteState.init = function() {
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.ableToMute = false;
				//noinspection JSPotentiallyInvalidUsageOfThis
				this.ableToCancel = false;
				notify('mute, say "listen"');
			};
			this.muteActionIn = new Action(0, this.muteState);
			this.muteActionIn.addCommand(new Command("mute", 0));
			this.muteActionIn.addCommand(new Command("don't listen", 0));
			this.muteActionOut = new Action(0, this);
			this.muteActionOut.addCommand(new Command("listen", 0));
			this.muteActionOut.act = function() {
				notify("demuted");
			};
			this.muteState.addAction(this.muteActionOut);
		}
		
		//abort
		if (this.cancelAction == null) {
			this.cancelAction = new Action(0, globalCommonState);
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
	
	//
	/**
	 * Analyse the speech alternatives after a result of the speech recognition.
	 * It runs throw all commands of all actions of this state and check if some commands are called.
	 *
	 * You can override this function.
	 *
	 * @param {[String]} alternatives
	 */
	this.analyseRecognitionResult = function(alternatives) {
		//alert("analyseRecognitionResult");
		var that = this;
		
		//simple hit object
		function Hit(execResult, alternativeIndex) {
			this.execResult = execResult;
			this.alternativeIndex = alternativeIndex;
		}
		//simple ActionHit object
		function ActionHit(action) {
			this.action = action;
			this.hits = [];
		}
		
		//run action of hit
		function runHitAction(actionHit) {
			var arguments = [];
			for (var i = 1;  i <= actionHit.action.parameterCount; i++) {
				arguments[i-1] = actionHit.hits[0].execResult[i].trim();
			}
			actionHit.action.act(arguments);
			that.stopSpeechRecognition();
			//change state or start new speech recognition
			if (actionHit.action.followingState != that) {
				changeActiveState(actionHit.action.followingState);
			} else {
				that.startSpeechRecognition();
			}
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
						if (execResult[0] == alternatives[k]) { //result.index == 0
							//perfect text match
							runHitAction(actionHits[actionHitsIndex]);
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
				//return;
			} else {
				//TODO more than one action
				notify(actionHits.length + " actions found");
				
				var text = "";
				//no perfect match
				for (i = 0; i < actionHits.length; i++) {
					for (j = 0; j < actionHits[i].hits.length; j++) {
						text += actionHits[i].hits[j].alternativeIndex + ": " + alternatives[actionHits[i].hits[j].alternativeIndex] + "\n";
					}
				}
				notify(text, 5000);
			}
		} else {
			//not found
			notify("not found: '" + alternatives[0] + "'");
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
		
		this.recognition.onresult = function(event) {
			var alternatives = [];
			for (var i = event.resultIndex; i < event.results.length; i++) {
				//all alteratives
				for (var j = 0; j < event.results[i].length; j++) {
					if (j in alternatives) {
						alternatives[j] += event.results[i][j].transcript;
					} else {
						alternatives[j] = event.results[i][j].transcript;
					}
				}
			}
			
			that.analyseRecognitionResult(alternatives);
		};
		
		this.recognition.onnomatch = function(event) {
			//alert("onnomatch");
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				alert("nomatch: " + event.results[i][0].transcript);
			}
		};
		
		this.recognition.onerror = function(event) {
			//alert("onerror");
			if (event.error == "not-allowed") {
				//get permission
				if (permissionGrounded) {
					chrome.tabs.create({url: chrome.extension.getURL("getPermission.html")});				
				}
				permissionGrounded = false;
			} else {
				//TODO: better error handling
				if (event.error != "no-speech") {
					alert(event.error + ": " + event.message);
				}
			}
		};

		//noinspection JSUnusedLocalSymbols
		this.recognition.onend = function(event) {
			//alert("onend");
			that.startSpeechRecognition();
		};
		
		this.recognition.start();
		//alert("start");
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
		//override onend and onerror function to suppress restart at fast switching of this.recognizing
		this.recognition.onerror = function(event) {};
		this.recognition.onend = function(event) {};
		this.recognition.stop();
	};
}