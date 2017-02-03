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
        this.cancelAction.cancelAct = function() {
            callContentScriptMethod("cancelLinkState", {});
            say(translate("stoppedInteractingWithLinks"));
        };
    };

    /**
     * show all links
     * @type {Action}
     */
    var showLinks = new Action("showLinks", 0, linkState);
    showLinks.act = function () {
        callContentScriptMethod("showLinks", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "globalCommonState") {
                        if (recognizing) activeState.stopSpeechRecognition();
                        changeActiveState(globalCommonState);
                    }
                }
            }
        });
    };
    this.addAction(showLinks);
    linkState.addAction(showLinks);

    /**
     * show next link
     * @type {Action}
     */
    var next = new Action("next", 0, linkState);
    next.act = function() {
        callContentScriptMethod("nextLink", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    linkState.addAction(next);

    /**
     * show previous link
     * @type {Action}
     */
    var prev = new Action("previous", 0, linkState);
    prev.act = function () {
        callContentScriptMethod("previousLink", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
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
    certainNNumber.act = function () {
        callContentScriptMethod("certainLinkByNumber", arguments[0], function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
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
    certainName.act = function () {
        callContentScriptMethod("certainLinkByName", arguments[0], function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    linkState.addAction(certainName);
    this.addAction(certainName);

    /**
     * change language for link
     * @type {Action}
     */
    var searchLanguage = new MultilingualAction("searchLanguage", certainName, [{notify: translate("whichLink"), say: translate("whichLink")}]);
    linkState.addAction(searchLanguage);
    this.addAction(searchLanguage);


    /**
     * open link
     * @type {Action}
     */
    var openLink = new Action("openLink", 0, globalCommonState);
    openLink.act = function () {
         callContentScriptMethod("openLink", {}, function (params) {
             if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
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
    openLinkNewTab.act = function () {
        callContentScriptMethod("openLinkNewTab", {});
    };
    linkState.addAction(openLinkNewTab);

}));
