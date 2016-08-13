/**
 * csm for searching for expressions
 */

/**
 * search for an expression
 */
addContentScriptMethod(
    new ContentScriptMethod("search", function (params) {
        $("body").highlightRegex();
        var str = params.toString();
        var searched = new RegExp(str, "ig");
        $("body").highlightRegex(searched);
        $("#ChromeSpeechControlMessagesBox").highlightRegex();
    })
);

/**
 * cancel searching
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelSearchState", function () {

    })
);
