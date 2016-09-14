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
     * next match
     */
    var next = new Action("nextMatch", 0, searchState);
    next.addCommand(new Command("next", 0));
    next.act = function() {
      callContentScriptMethod("nextMatch", {});
    };
    searchState.addAction(next);

    /**
     * previous match
     */
    var prev = new Action("previousMatch", 0, searchState);
    prev.addCommand(new Command("previous", 0));
    prev.act = function () {
        callContentScriptMethod("previousMatch", {});
    };
    searchState.addAction(prev);

    /**
     * go to certain match
     */
    var certainMatch = new Action("certainMatch", 1, searchState);
    certainMatch.addCommand(new Command("go to match (.*)", 1));
    certainMatch.act = function () {
        callContentScriptMethod("certainMatch", arguments[0]);
    };
    searchState.addAction(certainMatch);
}));