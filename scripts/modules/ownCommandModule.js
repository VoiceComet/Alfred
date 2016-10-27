/**
 * Module which generates the actions created by the user
 */
addModule(new Module("ownCommandModule", function() {

    var reloadPage = new Action("reloadPage", 0, globalCommonState);
    reloadPage.act = function () {
        chrome.tabs.reload();
    };
    this.addAction(reloadPage);

    var goBack = new Action("goBack", 0, globalCommonState);
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

    var goForward = new Action("goForward", 0, globalCommonState);
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

    //get all user actions from Storage and generate actions
    function generateCommands() {
        chrome.storage.sync.get({actions: []}, function (results) {
            results.actions.forEach(function (params) {
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
                if (key == "actions") {
                }
                //refresh active modules
                for (var i = 0; i < modules.length; i++) {
                    if (key == modules[i].settingName) {
                        modules[i].active = changes[key].newValue;
                        return;
                    }
                }
            }
        }
    }
    chrome.storage.onChanged.addListener(ownCommandChangeListener);

}));