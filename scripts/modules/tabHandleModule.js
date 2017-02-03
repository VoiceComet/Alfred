/**
 * tab handling actions
*/
addModule(new Module("tabHandleModule", function() {

	/**
 	 * open new tab
	 */
	var newTab = new Action("newTab", 0, globalCommonState);
	newTab.act = function() {
		chrome.tabs.create({active: true});
	};
	this.addAction(newTab);

	/**
	 * open new page
	 */
	var openPage = new Action("openNewPage", 1, globalCommonState);
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
 	 * close tab(s)/window
	 */
	var close = new Action("close", 1, globalCommonState);
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
	reload.act = function() {
		chrome.tabs.reload();
	};
	this.addAction(reload);

	/**
 	 * go back one page
	 */
	var goBack = new Action("goBackOnePage", 0, globalCommonState);
	goBack.act = function() {
		var curr = "";
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			curr = tabs[0].url;
			callContentScriptMethod("goBack", {}, function() {
				//wait until new page is loaded
				setTimeout(function () {
					chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
						if (curr === tabs[0].url) {
							say(translate("sayCannotGoBack"));
							notify(translate("notifyCannotGoBack"));
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
	var goForward = new Action("goForwardOnePage", 0, globalCommonState);
	goForward.act = function() {
		var curr = "";
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			curr = tabs[0].url;
			callContentScriptMethod("goForward", {}, function() {
				//wait until new page is loaded
				setTimeout(function () {
					chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
						if (curr === tabs[0].url) {
							say(translate("sayCannotGoForward"));
							notify(translate("notifyCannotGoForward"));
						}
					});
				}, 500);
			});
		});
	};
	this.addAction(goForward);

}));
