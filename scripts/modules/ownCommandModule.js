/**
 * Module which generates the actions created by the user
 */
addModule(new Module("ownCommandModule", function() {

    //get all user actions from Storage and generate actions
    function generateActions() {
        chrome.storage.sync.get(userActions, function () {

            userActions.forEach(function (params) {
                var command = params.command.toString();
                var action = params.action;
                switch (action) {
                    case "reloadPage":
                        var reloadPage = new Action("reloadPage", 0, globalCommonState);
                        reloadPage.addCommand(new Command("hello", 0));
                        reloadPage.act = function () {
                            chrome.tabs.reload();
                        };
                        this.addAction(reloadPage);
                        break;
                    case "goBack":
                        var goBack = new Action("goBack", 0, globalCommonState);
                        goBack.addCommand(new Command(command, 0));
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
                        break;
                    case "goForward":
                        var goForward = new Action("goForward", 0, globalCommonState);
                        goForward.addCommand(new Command(command, 0));
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
                        break;
                    default:
                        break;
                }
            })
        });
    }
    generateActions();

}));