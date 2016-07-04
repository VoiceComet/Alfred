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
	
	/**
	 * action: Action object
	*/
    this.addAction = function(action) {
        this.actions.push(action);
    };
	
	//has to override
	this.init = function() {};
	
    this.run = function() {
		this.init();
		if (this.recognizing) {
			this.createWebkitSpeechRecognition();			
		}
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
							arguments[k-1] = result[k];
						}
						this.actions[i].act(arguments);
						this.stopSpeechRecognition();
						changeActiveState(this.actions[i].followingState);
						return;
					}
				}
			}
		}
		alert("not found: '" + text + "'");
	};
	
	this.createWebkitSpeechRecognition = function() {
		var that = this;
		
		recognition = new webkitSpeechRecognition();
		recognition.continuous = this.continuous;
		recognition.interimResults = this.interimResults; //true: is faster, but you get more answers per speech
		recognition.lang = this.lang; //TODO: selectable language? de-DE
		
		recognition.onresult = function(event) {
			var text = "";
			for (var i = event.resultIndex; i < event.results.length; i++) {
				text += event.results[i][0].transcript;
			}
			that.analyseRecognitionResult(text.trim());
		};
		
		recognition.onnomatch = function(event) {
			//alert("onnomatch");
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				alert("nomatch: " + event.results[i][0].transcript);
			}
		};
		
		recognition.onerror = function(event) {
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
		
		recognition.onend = function(event) {
			//alert("onend");
			if (that.recognizing) {
				//restart
				that.createWebkitSpeechRecognition();
			}
		};
		
		recognition.start();
		//alert("start");
	}
	
	this.stopSpeechRecognition = function() {
		//override onend and onerror function to suppress restart at fast switching of this.recognizing
		recognition.onerror = function(event) {}; 
		recognition.onend = function(event) {}; 
		recognition.stop();
	}
}