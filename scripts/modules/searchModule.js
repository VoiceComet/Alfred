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
        notify("search for " + arguments[0]);
        callContentScriptMethod("search", arguments[0]);
    };
    this.addAction(search);
    searchState.addAction(search);

    /**
     * next hit
     */
    var next = new Action("next", 0, searchState);
    next.addCommand(new Command("next", 0));
    next.act = function() {
      notify("next");
    };
    searchState.addAction(next);
}));