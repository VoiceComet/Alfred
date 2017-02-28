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
		var repWhitespace = arguments[0].replace(/\s/g, '');
		var url = "http://www." + repWhitespace;
		chrome.tabs.update({url: url, active: true});
    };
    this.addAction(openPage);

    /**
     * open new page in new tab
     */
    var openPageNewTab = new Action("openPageNewTab", 1, globalCommonState);
    openPageNewTab.act = function(arguments) {
		var repWhitespace = arguments[0].replace(/\s/g, '');
		var url = "http://www." + repWhitespace;
		chrome.tabs.create({url: url, active: true});
    };
    this.addAction(openPageNewTab);

	/**
 	 * close tab
	 */
	var closeTab = new Action("closeTab", 0, globalCommonState);
	closeTab.act = function() {
		//closes current tab
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.remove(tab.id);
		})
	};
	this.addAction(closeTab);

	/**
	 * close window
	 */
	var closeWindow = new Action("closeWindow", 0, globalCommonState);
	closeWindow.act = function() {
		//closes current window
		chrome.windows.getCurrent(function(window) {
			chrome.windows.remove(window.id);
		})
	};
	this.addAction(closeWindow);

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
