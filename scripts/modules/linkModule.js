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
        };
    };

    /**
     * show all links
     * @type {Action}
     */
    var showLinks = new Action("showLinks", 0, linkState);
    showLinks.addCommand(new Command("show links", 0));
    showLinks.act = function () {
        callContentScriptMethod("showLinks", {})
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
        callContentScriptMethod("nextLink", {});
    };
    linkState.addAction(next);

    /**
     * show previous link
     * @type {Action}
     */
    var prev = new Action("previousLink", 0, linkState);
    prev.addCommand(new Command("previous", 0));
    prev.act = function () {
        callContentScriptMethod("previousLink", {});
    };
    linkState.addAction(prev);

    /**
     * go to certain link
     * @type {Action}
     */
    var certainMatch = new Action("certainLink", 1, linkState);
    certainMatch.addCommand(new Command("go to link (.*)", 1));
    certainMatch.act = function () {
        callContentScriptMethod("certainLink", arguments[0]);
    };
    linkState.addAction(certainMatch);

    /**
     * open link
     */
    var openLink = new Action("openLink", 0, globalCommonState);
    openLink.addCommand(new Command("open", 0));
    openLink.act = function () {
         callContentScriptMethod("openLink", {});
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
