/**
 * Browser actions
*/
addModule(new Module("browserActionsModule", function() {

	/**
 	 * open new tab
	 */
	var newTab = new Action("new Tab", 0, globalCommonState);
	newTab.addCommand(new Command("new tab", 0));
	newTab.act = function() {
		chrome.tabs.create({active: true});
	};
	this.addAction(newTab);

	/**
	 * open new page
	 */
	var openPage = new Action("open new page", 1, globalCommonState);
	openPage.addCommand(new Command("open page (.*)", 1));
	openPage.act = function(arguments) {
		var url = "";
		var repWhitespace = "";
		//opens new page in new tab
		if(arguments[0].search(/new tab/) != -1) {
			// opens page in new tab
			repWhitespace = arguments[0].replace(/\s/g, '');
			var split = repWhitespace.split("innewtab", 1);
			url = "http://www." + split + ".com";
			chrome.tabs.create({url: url, active: true});
		//opens new page in current tab
		} else {
			//opens page in current tab
			repWhitespace = arguments[0].replace(/\s/g, '');
			url = "http://www." + repWhitespace + ".com";
			chrome.tabs.update({url: url, active: true});
		}
	};
	this.addAction(openPage);

	/**
 	 * close tab(s)/window/panel
	 */
	var close = new Action("close", 1, globalCommonState);
	close.addCommands([new Command("close (tab)", 1), new Command("close (window)", 1)]);
	close.act = function(arguments) {
		if(arguments[0].search(/tab/) != -1) {
			//closes current tab
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.remove(tab.id);
			})
		} else {
			//closes current window
			chrome.windows.getCurrent(function(window) {
				chrome.windows.remove(window.id);
			})
		}
	};
	this.addAction(close);

	/**
 	 * reload the current tab
	 */
	var reload = new Action("reload", 0, globalCommonState);
	reload.addCommand(new Command("reload", 0));
	reload.act = function() {
		chrome.tabs.reload();
	};
	this.addAction(reload);

	/**
 	 * go back one page
	 */
	var goBack = new Action("go back one page", 0, globalCommonState);
	goBack.addCommand(new Command("go back", 0));
	goBack.act = function() {
		var curr = "";
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			curr = tabs[0].url;
			callContentScriptMethod("goBack", {}, function() {
				//wait until new page is loaded
				setTimeout(function () {
					chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
						if (curr === tabs[0].url) {
							say("I am at the first page. I cannot go back a page");
							notify("I can not go back");
						}
					});
				}, 500);
			});
		});
	};
	this.addAction(goBack);

	/**
	 * go forward one page
     */
	var goForward = new Action("go forward one page", 0, globalCommonState);
	goForward.addCommand(new Command("go forward", 0));
	goForward.act = function() {
		var curr = "";
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			curr = tabs[0].url;
			callContentScriptMethod("goForward", {}, function() {
				//wait until new page is loaded
				setTimeout(function () {
					chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
						if (curr === tabs[0].url) {
							say("I am at the last page. I cannot go forward a page");
							notify("I can not go forward");
						}
					});
				}, 500);
			});
		});
	};
	this.addAction(goForward);

    /**
     * scroll to top of the page
     */
    var scrollToTop = new Action("scroll to top", 0, globalCommonState);
    scrollToTop.addCommand(new Command("(?:scroll )?(?:to )?(?:the )?top", 0));
    scrollToTop.act = function() {
        callContentScriptMethod("scrollToTop", {}, function (params) {
        	if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
    };
    this.addAction(scrollToTop);

	/**
	 * scroll to the middle of the page
     */
	var scrollToMiddle = new Action("scroll to middle", 0, globalCommonState);
	scrollToMiddle.addCommand(new Command("(?:scroll )?(?:to )?(?:the )?middle", 0));
	scrollToMiddle.act = function() {
		callContentScriptMethod("scrollToMiddle", {}, function (params) {
			if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
	};
	this.addAction(scrollToMiddle);

    /**
     * scroll to the bottom of the page
     */
    var scrollToBottom = new Action("scroll to bottom", 0, globalCommonState);
    scrollToBottom.addCommand(new Command("(?:scroll )?(?:to )?(?:the )?bottom", 0));
    scrollToBottom.act = function() {
        callContentScriptMethod("scrollToBottom", {}, function (params) {
			if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
	};
    this.addAction(scrollToBottom);

    /**
     * scroll up
     */
    var scrollUp = new Action("scroll up", 0, globalCommonState);
    scrollUp.addCommand(new Command("(?:scroll )?up", 0));
    scrollUp.act = function() {
        callContentScriptMethod("scrollUp", {}, function (params) {
			if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
	};
    this.addAction(scrollUp);

    /**
     * scroll down
     */
    var scrollDown = new Action("scroll down", 0, globalCommonState);
    scrollDown.addCommand(new Command("(?:scroll )?down", 0));
    scrollDown.act = function() {
        callContentScriptMethod("scrollDown", {}, function (params) {
			if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
	};
    this.addAction(scrollDown);

    /**
     * scroll left
     */
    var scrollLeft = new Action("scroll left", 0, globalCommonState);
    scrollLeft.addCommand(new Command("(?:scroll )?left", 0));
    scrollLeft.act = function() {
        callContentScriptMethod("scrollLeft", {}, function (params) {
			if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
	};
    this.addAction(scrollLeft);

    /**
     * scroll right
     */
    var scrollRight = new Action("scroll right", 0, globalCommonState);
    scrollRight.addCommand(new Command("(?:scroll )?right", 0));
    scrollRight.act = function() {
        callContentScriptMethod("scrollRight", {}, function (params) {
			if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
				say(params.content);
			}
		});
	};
    this.addAction(scrollRight);

}));
