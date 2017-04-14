/**
 * module for searching expressions
 */
addModule(new Module("searchModule", function() {

    /**
     * State for searching an expression
     */
    var searchState = new State("searchState");
    searchState.init = function () {
        this.cancelAction.cancelAct = function() {
            callContentScriptMethod("cancelSearchState", {});
            say(translate("stoppedSearching"));
        };
    };

    /**
     * search for an expression
     * @type {Action}
     */
    var search = new Action("search", 1, searchState);
    search.act = function (arguments) {
        callContentScriptMethod("search", arguments[0], function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "globalCommonState") {
                        changeActiveState(globalCommonState);
                    }
                }
            }
        });
    };
    this.addAction(search);
    searchState.addAction(search);

    /**
     * change language of expression
     * @type {Action}
     */
    var searchLanguage = new MultilingualAction("searchLanguage", search, [{notify: "whatShallISearchFor", say: "whatShallISearchFor"}]);
    this.addAction(searchLanguage);
    searchState.addAction(searchLanguage);

    /**
     * next match
     * @type {Action}
     */
    var next = new Action("next", 0, searchState);
    next.act = function() {
      callContentScriptMethod("nextMatch", {}, function (params) {
          if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
              say(params.content);
          }
      });
    };
    searchState.addAction(next);

    /**
     * previous match
     * @type {Action}
     */
    var prev = new Action("previous", 0, searchState);
    prev.act = function () {
        callContentScriptMethod("previousMatch", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    searchState.addAction(prev);

    /**
     * go to certain match
     * @type {Action}
     */
    var certainMatch = new Action("certainMatch", 1, searchState);
    certainMatch.act = function () {
        callContentScriptMethod("certainMatch", arguments[0], function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    searchState.addAction(certainMatch);
}));