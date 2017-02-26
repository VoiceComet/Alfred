/**
 * State
 * @param {String} internalName
 * @constructor
 */
function State (internalName) {
    this.internalName = internalName;
    this.actions = [];
	/** @private */
	this.initialized = false;
	this.accessibleWithCancelAction = true;

	this.muted = false;
	
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
				var commands = that.muteActionOut.getCommands();
				notify(translate("mutedSayXOrY").format([commands[0].expression, commands[1].expression]).replace(new RegExp("\\(.\\+\\)", 'g'), butlerName));
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
					notify(translate("welcomeBack"));
					say(translate("welcomeBack"));
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
	 */
    this.run = function() {
		if (!this.initialized) {
			this.generateStandardActions();
			this.init();
			this.activateStandardActions();
			this.initialized = true;
		}
		this.runAtEntrance();
    };

	/**
	 * change the active state
	 * @param {State} state
	 * @param {Boolean} [cancelStack=true] - true, if the cancel stack should be filled
	 */
	this.changeActiveState = function (state, cancelStack) {
		//change state or start new speech recognition
		if (state != this) {
			changeActiveState(state, (typeof cancelStack === 'undefined' || cancelStack === true));
		}
	};
}