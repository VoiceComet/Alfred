/**
 * csm for searching for expressions
 */
var found = [];
var i = 0;

/**
 * search for an expression
 */
addContentScriptMethod(
    new ContentScriptMethod("search", function (params) {
        $("body").highlightRegex();
        var str = params.toString();
        var searched = new RegExp(str, "gmi");
        $("body").highlightRegex(searched);
        $("#ChromeSpeechControlMessagesBox").highlightRegex();
        //var htmlText = $("body").html().toString();
        //var result = htmlText.match(searched);
        found = document.getElementsByClassName("highlight");
        if(found.length === 0) {
            showMessage({title: "Attention!", content: "couldn't find " + params});
        } else {
            showMessage({content: "search for " + params});
        }
        found[0].style.backgroundColor = "cornflowerblue";
        i = 0;
        $('html, body').animate({ scrollTop: $(found[0]).offset().top - window.innerHeight / 2}, 1000);
    })
);

/**
 * find next hit
 */
addContentScriptMethod(
    new ContentScriptMethod("next", function () {
        //highlights the next match
        if(found.length > 1) {
            if (i < found.length - 1) {
                found[i].style.backgroundColor = "yellow";
                found[i + 1].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(found[i + 1]).offset().top - window.innerHeight / 2}, 1000);
                i++;
                //reached last element -> continue at 0
            } else {
                found[i].style.backgroundColor = "yellow";
                found[0].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(found[0]).offset().top - window.innerHeight / 2}, 1000);
                i = 0;
            }
            showMessage({content: "show next hit"});
        } else {
            showMessage({title: "Attention!", content: "only one match was found"});
        }
    })
);

/**
 * find previous hit
 */
addContentScriptMethod(
    new ContentScriptMethod("previous", function () {
        if(found.length > 1) {
            if (i > 0) {
                found[i].style.backgroundColor = "yellow";
                found[i - 1].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(found[i - 1]).offset().top - window.innerHeight / 2}, 1000);
                i--;
                //reached first element -> continue with last
            } else {
                found[i].style.backgroundColor = "yellow";
                found[found.length - 1].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(found[found.length - 1]).offset().top - window.innerHeight / 2}, 1000);
                i = found.length - 1;
            }
            showMessage({content: "show next hit"});
        } else {
            showMessage({title: "Attention!", content: "only one match was found"});
        }
    })
);

/**
 * cancel searching
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelSearchState", function () {

    })
);
