/**
 * Module for creating and interacting with bookmarks
 */

addModule(new Module("bookmarkModule", function () {

    /**
     * state for interacting with modules
     */
    var bookmarkState = new State("bookmarkState");
    bookmarkState.init = function () {
        notify("entered bookmark state");
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelObjectState", {});
            notify("canceled bookmark state");
        };
    };

    /**
     * state which listens for title
     */
    var bookmarkListenState = new State("bookmarkListenState");

    /**
     * add bookmark
     * @type {Action}
     */
    var addBookmark = new Action("addBookmark", 0, bookmarkListenState);
    addBookmark.addCommand(new Command("add bookmark", 0));
    addBookmark.act = function () {
        callContentScriptMethod("addBookmark", {});
    };
    this.addAction(addBookmark);

    /**
     * say title for bookmark/folder
     */
    var sayTitle = new Action("say title", 1, bookmarkState);
    sayTitle.addCommand(new Command("(.+)" ,1));
    sayTitle.act = function (params) {

    }
}));
