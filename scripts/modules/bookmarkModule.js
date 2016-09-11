/**
 * Module for creating and interacting with bookmarks
 */

addModule(new Module("bookmarkModule", function () {

    /**
     * State for interacting with modules
     */
    var bookmarkState = new State("bookmarkState");
    bookmarkState.init = function () {
        notify("entered bookmark state");
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelObjectState", {});
            notify("canceled bookmark state");
        };
    };

    var addBookmark = new Action("addBookmark", 0, bookmarkState);
    addBookmark.addCommand(new Command("add bookmark", 0));
    addBookmark.act = function () {
        callContentScriptMethod("addBookmark", {});
    };
    this.addAction(addBookmark);

}));
