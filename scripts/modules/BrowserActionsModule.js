/**
 * Browser actions
*/
addModule(new Module("BrowserActionsModule", function() {
/**
 * open new tab
*/

	var newTabAction = new Action(0, globalCommonState);
	newTabAction.addCommand(new Command("new tab", 0));
	newTabAction.act = function() {
		chrome.tabs.create({active: true});
	};
	this.addAction(newTabAction);
	
	var openInNewTab = new Action(0, globalCommonState);
	openInNewTab.addCommand(new Command(/open .*/, 0));
	openInNewTab.act = function() {
		var re = openInNewTab.commands[0].expression;
		//alert("Test2");
		//var url = "http://www." + re + ".com"
		//alert(url);
		//chrome.tabs.create({url: url, active: true});
	};
	this.addAction(openInNewTab);
	
/**
 * search for an expression
*/

	var search = new Action(0, globalCommonState);
	search.addCommand(new Command(/search for .*/, 0));
	search.act = function() {
		alert("searched for ");
	};
	this.addAction(search);
}));
