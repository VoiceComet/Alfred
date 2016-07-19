/**
 * Browser actions
*/
addModule(new Module("BrowserActionsModule", function() {

	var backs = [];
/**
 * opens new tab
*/
	var newTab = new Action(0, globalCommonState);
	newTab.addCommand(new Command("new tab", 0));
	newTab.act = function() {
		chrome.tabs.create({active: true});
	};
	this.addAction(newTab);

/**
 * opens new page
*/	
	var openPage = new Action(1, globalCommonState);
	openPage.addCommand(new Command("open (.*)", 1));
	openPage.act = function(arguments) {
		var url = "";
		var repWhitespace = "";
		if(arguments[0].search(/new tab/) != -1) {
			// opens page in new tab
			repWhitespace = arguments[0].replace(/\s/g, '');
			var split = repWhitespace.split("innewtab", 1);
			url = "http://www." + split + ".com";
			chrome.tabs.create({url: url, active: true});	
		} else {
			//opens page in current tab
			repWhitespace = arguments[0].replace(/\s/g, '');
			url = "http://www." + repWhitespace + ".com";
			chrome.tabs.update({url: url, active: true});
		}
	};
	this.addAction(openPage);

/**
 * closes tab(s)/window/panel
*/
	
	var close = new Action(1, globalCommonState);
	close.addCommand(new Command("close (.*)", 1));
	close.act = function(arguments) {
		if(arguments[0].search(/tab/) != -1) {
			//closes current tab
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.remove(tab.id);
			});
		} else {
			//closes current window
			chrome.windows.getCurrent(function(window) {
				chrome.windows.remove(window.id);
			});
		}
	};
	this.addAction(close);

/**
 * reloads the current tab
*/
	var reload = new Action(0, globalCommonState);
	reload.addCommand(new Command("reload", 0));
	reload.act = function() {
		chrome.tabs.reload();
	};
	this.addAction(reload);

/**
 * opens last visited page
*/
	var lastVisited = new Action(0, globalCommonState);
	lastVisited.addCommand(new Command("go back", 0));
	lastVisited.act = function() {
		var test = true;
		notify("go back one page");
		chrome.history.search({text: ''}, function(historyItem) {
			backs.push(historyItem[0].url);
			for(var i = 1; i < historyItem.length; i++) {
				test = true;
				for(var h = 0; h < backs.length; h++) {
					console.log(backs.length);
					console.log(backs[h]);
					if (historyItem[i].url === backs[h]) {
						test = false;
					}
				}
				if(test === true) {
					backs.push(historyItem[i].url);
					chrome.tabs.update({url: historyItem[i].url, active: true});
					return;
				}
			}
		});
	};
	this.addAction(lastVisited);

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
