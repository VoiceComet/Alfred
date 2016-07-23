/**
 * Browser actions
*/
addModule(new Module("BrowserActionsModule", function() {

	/**
 	 * open new tab
	 */
	var newTab = new Action(0, globalCommonState);
	newTab.addCommand(new Command("new tab", 0));
	newTab.act = function() {
		chrome.tabs.create({active: true});
	};
	this.addAction(newTab);

	/**
	 * open new page
	 */
	var openPage = new Action(1, globalCommonState);
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
	var close = new Action(1, globalCommonState);
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
	var reload = new Action(0, globalCommonState);
	reload.addCommand(new Command("reload", 0));
	reload.act = function() {
		chrome.tabs.reload();
	};
	this.addAction(reload);

	/**
 	 * go back one page
	 */
	var goBack = new Action(0, globalCommonState);
	goBack.addCommand(new Command("go back", 0));
	goBack.act = function() {
		notify("go back one page");
		callContentScriptMethod("goBack", {});
	};
	this.addAction(goBack);

	/**
	 * go forward one page
     */
	var goForward = new Action(0, globalCommonState);
	goForward.addCommand(new Command("go forward", 0));
	goForward.act = function() {
		notify("go forward one page");
		callContentScriptMethod("goForward", {});
	};
	this.addAction(goForward);

	/**
 	 * search for an expression
	 */
	var search = new Action(1, globalCommonState);
	search.addCommand(new Command("search for (.*)", 1));
	search.act = function(arguments) {
		alert("searched for " + arguments[0]);
	};
	this.addAction(search);
}));
