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
	
	var openInNewTab = new Action(1, globalCommonState);
	openInNewTab.addCommand(new Command("open (.*)", 1));
	openInNewTab.act = function(arguments) {
		var url = "http://www." + arguments[0] + ".com"
		chrome.tabs.create({url: url, active: true});
	};
	this.addAction(openInNewTab);
	
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
