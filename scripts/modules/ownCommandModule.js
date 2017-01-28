/**
 * Module which generates the actions created by the user
 */
addModule(new Module("ownCommandModule", function() {

    var that = this;

    /**
     * reload the current tab
     */
    var reloadPage = new Action("OwnReloadPage", 0, globalCommonState);
    reloadPage.act = function () {
        chrome.tabs.reload();
    };
    this.addAction(reloadPage);

    /**
     * go back one page
     */
    var goBack = new Action("OwnGoBack", 0, globalCommonState);
    goBack.act = function () {
        var curr = "";
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            curr = tabs[0].url;
            callContentScriptMethod("goBack", {}, function () {
                //wait until new page is loaded
                setTimeout(function () {
                    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
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
    var goForward = new Action("OwnGoForward", 0, globalCommonState);
    goForward.act = function () {
        var curr = "";
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            curr = tabs[0].url;
            callContentScriptMethod("goForward", {}, function () {
                //wait until new page is loaded
                setTimeout(function () {
                    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
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
    var scrollToTop = new Action("OwnScrollToTop", 0, globalCommonState);
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
    var scrollToMiddle = new Action("OwnScrollToMiddle", 0, globalCommonState);
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
    var scrollToBottom = new Action("OwnScrollToBottom", 0, globalCommonState);
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
    var scrollUp = new Action("OwnScrollUp", 0, globalCommonState);
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
    var scrollDown = new Action("OwnScrollDown", 0, globalCommonState);
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
    var scrollLeft = new Action("OwnScrollLeft", 0, globalCommonState);
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
    var scrollRight = new Action("OwnScrollRight", 0, globalCommonState);
    scrollRight.act = function() {
        callContentScriptMethod("scrollRight", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollRight);

    //TODO addCommands
    //get all user actions from Storage and generate actions
    function generateCommands() {
        chrome.storage.sync.get({ownCommands: []}, function (results) {
            results.ownCommands.forEach(function (params) {
                var command = params.command.toString();
                var action = params.action;
                switch (action) {
                    case "reloadPage":
                        reloadPage.addCommand(new Command(command, 0));
                        break;
                    case "goBack":
                        goBack.addCommand(new Command(command, 0));
                        break;
                    case "goForward":
                        goForward.addCommand(new Command(command, 0));
                        break;
                    case "scrollTop":
                        scrollToTop.addCommand(new Command(command, 0));
                        break;
                    case "scrollMiddle":
                        scrollToMiddle.addCommand(new Command(command, 0));
                        break;
                    case "scrollBottom":
                        scrollToBottom.addCommand(new Command(command, 0));
                        break;
                    case "scrollUp":
                        scrollUp.addCommand(new Command(command, 0));
                        break;
                    case "scrollDown":
                        scrollDown.addCommand(new Command(command, 0));
                        break;
                    case "scrollLeft":
                        scrollLeft.addCommand(new Command(command, 0));
                        break;
                    case "scrollRight":
                        scrollRight.addCommand(new Command(command, 0));
                        break;
                    default:
                        break;
                }
            })
        });
    }
    generateCommands();

    function ownCommandChangeListener(changes) {
        for (var key in changes)  {
            if (changes.hasOwnProperty(key)) {
                if (key == "ownCommands") {
                    for(var j = 0; j < that.actions.length; j++) {
                        that.actions[j].commands = [];
                    }
                    generateCommands();
                }
            }
        }
    }
    chrome.storage.onChanged.addListener(ownCommandChangeListener);

}));