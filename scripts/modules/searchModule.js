/**
 * module for searching expressions
 */
addModule(new Module("searchModule", function() {
    /**
     * State for searching an expression
     */
    var searchState = new State("searchState");
    searchState.init = function () {
        notify("entered search state");
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelSearchState", {});
            notify("canceled search state");
        };
    };

    /**
     * search for an expression
     */
    var search = new Action("search expression", 1, searchState);
    search.addCommand(new Command("search for (.*)", 1));
    search.act = function (arguments) {
        callContentScriptMethod("search", arguments[0]);
    };
    this.addAction(search);
    searchState.addAction(search);

    /**
     * next hit
     */
    var next = new Action("nextHit", 0, searchState);
    next.addCommand(new Command("next", 0));
    next.act = function() {
      callContentScriptMethod("next", {});
    };
    searchState.addAction(next);

    /**
     * previous hit
     */
    var prev = new Action("previousHit", 0, searchState);
    prev.addCommand(new Command("previous", 0));
    prev.act = function () {
        callContentScriptMethod("previous", {});
    };
    searchState.addAction(prev);
}));