/**
 * name: str, name of state
*/
function State (name) {
    this.name = name;
    this.actions = [];
	
	this.recognition;
	this.recognizing = true;
	this.continuous = false;
	this.interimResults = false;
	this.lang = 'en';
	
	//standard actions
	this.ableToMute = true;
	this.muteActionIn;
	this.muteActionOut;
	this.muteState;
	this.ableToCancel = true;
	this.cancelAction;
	
	/**
	 * action: Action object
	*/
    this.addAction = function(action) {
        this.actions.push(action);
    };
	
	//generate standard actions
	this.generateStandardActions = function() {
		//mute
		if (this.muteState == null) {
			this.muteState = new State("MuteState of " + this.name);
			this.muteState.init = function() {
				this.ableToMute = false;
				this.ableToCancel = false;
				alert('mute, say "listen"');
			}
			this.muteActionIn = new Action(0, this.muteState);
			this.muteActionIn.addCommand(new Command("mute", 0));
			this.muteActionOut = new Action(0, this);
			this.muteActionOut.addCommand(new Command("listen", 0));
			this.muteActionOut.act = function() {
				alert("demuted");
			}
			this.muteState.addAction(this.muteActionOut);
		}
		
		//abort
		if (this.cancelAction == null) {
			this.cancelAction = new Action(0, globalCommonState);
			this.cancelAction.addCommand(new Command("cancel", 0));
			this.cancelAction.act = function() {
				alert("cancel");
			}
		}
	};
	
	//generate standard actions
	this.activateStandardActions = function() {
		if (this.ableToMute) {
			this.addAction(this.muteActionIn);
		}
		
		if (this.ableToCancel) {
			this.addAction(this.cancelAction);
		}
	};
	
	//has to override
	this.init = function() {};
	
    this.run = function() {
		this.generateStandardActions();
		this.init();
		this.activateStandardActions();
		this.startSpeechRecognition();
    };
	
	//you can override this function
	this.analyseRecognitionResult = function(text) {
		//alert("analyseRecognitionResult");
		for (var i = 0; i < this.actions.length; i++) {
			for (var j = 0; j < this.actions[i].commands.length; j++) {
				//test the regular expression
				var result = this.actions[i].commands[j].expression.exec(text);
				if (result != null) {
					//text longer than found expression?
					if (result[0] == text) { //result.index == 0
						var arguments = [];
						for (var k = 1;  k <= this.actions[i].commands[j].parameterCount; k++) {
							arguments[k-1] = result[k].trim();
						}
						this.actions[i].act(arguments);
						this.stopSpeechRecognition();
						//change state or start new speech recognition
						if (this.actions[i].followingState != this) {
							changeActiveState(this.actions[i].followingState);
						} else {
							this.startSpeechRecognition();
						}
						return;
					}
				}
			}
		}
		alert("not found: '" + text + "'");
	};
	
	this.createWebkitSpeechRecognition = function() {
		var that = this;
		
		this.recognition = new webkitSpeechRecognition();
		this.recognition.continuous = this.continuous;
		this.recognition.interimResults = this.interimResults; //true: is faster, but you get more answers per speech
		this.recognition.lang = this.lang; //TODO: selectable language? de-DE
		
		this.recognition.onresult = function(event) {
			var text = "";
			for (var i = event.resultIndex; i < event.results.length; i++) {
				text += event.results[i][0].transcript;
			}
			that.analyseRecognitionResult(text.trim());
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
		
		this.recognition.onend = function(event) {
			//alert("onend");
			that.startSpeechRecognition();
		};
		
		this.recognition.start();
		//alert("start");
	}
	
	this.startSpeechRecognition = function() {
		if (this.recognizing) {
			this.createWebkitSpeechRecognition();
		}
	}
	
	this.stopSpeechRecognition = function() {
		//override onend and onerror function to suppress restart at fast switching of this.recognizing
		this.recognition.onerror = function(event) {};
		this.recognition.onend = function(event) {};
		this.recognition.stop();
	}
}