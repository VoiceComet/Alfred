/**
 * Browser actions
*/
addModule(new Module("BrowserActionsModule", function() {

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
	openPage.addCommand(new Command("open (.*)", 1));
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
	close.addCommand(new Command("close (.*)", 1));
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
		notify("go back one page");
		callContentScriptMethod("goBack", {});
	};
	this.addAction(goBack);

	/**
	 * go forward one page
     */
	var goForward = new Action("go forward one page", 0, globalCommonState);
	goForward.addCommand(new Command("go forward", 0));
	goForward.act = function() {
		notify("go forward one page");
		callContentScriptMethod("goForward", {});
	};
	this.addAction(goForward);

	/**
 	 * search for an expression
	 */
	var search = new Action("search expression", 1, globalCommonState);
	search.addCommand(new Command("search for (.*)", 1));
	search.act = function(arguments) {
		alert("searched for " + arguments[0]);
	};
	this.addAction(search);

    /**
     * scroll to top of the page
     */
    var scrollToTop = new Action("scroll to top", 0, globalCommonState);
    scrollToTop.addCommand(new Command("[^scroll $|^scroll to $]?top", 0));
    scrollToTop.act = function() {
        callContentScriptMethod("scrollToTop", {});
    };
    this.addAction(scrollToTop);

	/**
	 * scroll to the middle of the page
     */
	var scrollToMiddle = new Action("scroll to middle", 0, globalCommonState);
	scrollToMiddle.addCommand(new Command("[^scroll $|^scroll to $]?middle", 0));
	scrollToMiddle.act = function() {
		callContentScriptMethod("scrollToMiddle", {})
	};
	this.addAction(scrollToMiddle);

    /**
     * scroll to the bottom of the page
     */
    var scrollToBottom = new Action("scroll to bottom", 0, globalCommonState);
    scrollToBottom.addCommand(new Command("[^scroll $|^scroll to $]?bottom", 0));
    scrollToBottom.act = function() {
        callContentScriptMethod("scrollToBottom", {});
    };
    this.addAction(scrollToBottom);

    /**
     * scroll up
     */
    var scrollUp = new Action("scroll up", 0, globalCommonState);
    scrollUp.addCommand(new Command("[^scroll &]?up", 0));
    scrollUp.act = function() {
        callContentScriptMethod("scrollUp", {});
    };
    this.addAction(scrollUp);

    /**
     * scroll down
     */
    var scrollDown = new Action("scroll down", 0, globalCommonState);
    scrollDown.addCommand(new Command("[^scroll &]?down", 0));
    scrollDown.act = function() {
        callContentScriptMethod("scrollDown", {});
    };
    this.addAction(scrollDown);

    /**
     * scroll left
     */
    var scrollLeft = new Action("scroll left", 0, globalCommonState);
    scrollLeft.addCommand(new Command("[^scroll &]?left", 0));
    scrollLeft.act = function() {
        callContentScriptMethod("scrollLeft", {});
    };
    this.addAction(scrollLeft);

    /**
     * scroll right
     */
    var scrollRight = new Action("scroll right", 0, globalCommonState);
    scrollRight.addCommand(new Command("[^scroll &]?right", 0));
    scrollRight.act = function() {
        callContentScriptMethod("scrollRight", {});
    };
    this.addAction(scrollRight);

    /**
     * zoom in
	*/
    var zoomIn = new Action("zoom in", 0, globalCommonState);
    zoomIn.addCommand(new Command("[^zoom &]?in", 0));
    zoomIn.act = function() {
    	notify("zoom in");
        callContentScriptMethod("zoomIn", {});
    };
    this.addAction(zoomIn);
}));
