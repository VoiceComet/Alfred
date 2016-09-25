/**
 * Module for interacting with links
 */

addModule(new Module("linkModule", function () {

    /**
     * link State
     * @type {State}
     */
    var linkState = new State("linkState");
    linkState.init = function () {
        notify("entered link state");
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelLinkState", {});
            notify("canceled link state");
            say("I stopped interacting with links");
        };
    };

    /**
     * show all links
     * @type {Action}
     */
    var showLinks = new Action("showLinks", 0, linkState);
    showLinks.addCommand(new Command("show links", 0));
    showLinks.act = function () {
        callContentScriptMethod("showLinks", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    this.addAction(showLinks);
    linkState.addAction(showLinks);

    /**
     * show next link
     * @type {Action}
     */
    var next = new Action("nextLink", 0, linkState);
    next.addCommand(new Command("next", 0));
    next.act = function() {
        callContentScriptMethod("nextLink", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    linkState.addAction(next);

    /**
     * show previous link
     * @type {Action}
     */
    var prev = new Action("previousLink", 0, linkState);
    prev.addCommand(new Command("previous", 0));
    prev.act = function () {
        callContentScriptMethod("previousLink", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    linkState.addAction(prev);

    /**
     * go to certain link by number
     * @type {Action}
     */
    var certainNNumber = new Action("certainLinkByNumber", 1, linkState);
    certainNNumber.addCommand(new Command("go to number (.*)", 1));
    certainNNumber.act = function () {
        callContentScriptMethod("certainLinkByNumber", arguments[0], function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    linkState.addAction(certainNNumber);

    /**
     * go to certain link by name
     * @type {Action}
     */
    var certainName = new Action("certainLinkByName", 1, linkState);
    certainName.addCommand(new Command("go to link (.*)", 1));
    certainName.act = function () {
        callContentScriptMethod("certainLinkByName", arguments[0], function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    linkState.addAction(certainName);


    /**
     * open link
     * @type {Action}
     */
    var openLink = new Action("openLink", 0, globalCommonState);
    openLink.addCommand(new Command("open", 0));
    openLink.act = function () {
         callContentScriptMethod("openLink", {}, function (params) {
             if (params.content) {
                 say(params.content);
             }
         });
    };
    linkState.addAction(openLink);

    /**
     * open link in new tab
     * @type {Action}
     */
    var openLinkNewTab = new Action("openLinkNewTab", 0, globalCommonState);
    openLinkNewTab.addCommand(new Command("open in new tab", 0));
    openLinkNewTab.act = function () {
        callContentScriptMethod("openLinkNewTab", {});
    };
    linkState.addAction(openLinkNewTab);

}));
