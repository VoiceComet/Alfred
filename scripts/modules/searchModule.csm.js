/**
 * csm for searching for expressions
 */
var result = [];
var i = 0;

/**
 * search for an expression
 */
addContentScriptMethod(
    new ContentScriptMethod("search", function (params) {
        //unmark elements from last search
        $("body").unmark();
        var str = params.toString();
        var searched = new RegExp(str, "gmi");
        $("body").markRegExp(searched, {
            "className": "highlight",
            "exclude": [
                "script",
                "style",
                "noscript",
                "#ChromeSpeechControlDIV *"
            ]
        });
        //if element is hidden on page remove class highlight
        $(".highlight:hidden").unmark();
        $(".highlight").each(function () {
            if (window.getComputedStyle(this).getPropertyValue("visibility") === "hidden") {
                $(this).unmark();
            }
        });

        result = jQuery.makeArray(document.getElementsByClassName("highlight"));

        if(result.length === 0) {
            showMessage({title: "Attention!", content: "couldn't find " + params});
        } else {
            showMessage({content: "search for " + params});
        }
        i = 0;
        result[0].style.backgroundColor = "cornflowerblue";
        $('html, body').animate({ scrollTop: $(result[0]).offset().top - window.innerHeight / 2}, 1000);
        $('html, body').animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
    })
);

/**
 * find next hit
 */
addContentScriptMethod(
    new ContentScriptMethod("next", function () {
        //highlights the next match
        if(result.length > 1) {
            if (i < result.length - 1) {
                result[i].style.backgroundColor = "yellow";
                result[i + 1].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(result[i + 1]).offset().top - window.innerHeight / 2}, 1000);
                $('html, body').animate({scrollLeft: $(result[i + 1]).offset().left - window.innerWidth / 2}, 1000);
                i++;
                //reached last element -> continue at 0
            } else {
                result[i].style.backgroundColor = "yellow";
                result[0].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(result[0]).offset().top - window.innerHeight / 2}, 1000);
                $('html, body').animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
                i = 0;
            }
            showMessage({content: "show next hit"});
        } else {
            showMessage({title: "Attention!", content: "no match found"});
        }
    })
);

/**
 * find previous hit
 */
addContentScriptMethod(
    new ContentScriptMethod("previous", function () {
        if(result.length > 1) {
            if (i > 0) {
                result[i].style.backgroundColor = "yellow";
                result[i - 1].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(result[i - 1]).offset().top - window.innerHeight / 2}, 1000);
                $('html, body').animate({scrollLeft: $(result[i - 1]).offset().left - window.innerWidth / 2}, 1000);
                i--;
                //reached first element -> continue with last
            } else {
                result[i].style.backgroundColor = "yellow";
                result[result.length - 1].style.backgroundColor = "cornflowerblue";
                $('html, body').animate({scrollTop: $(result[result.length - 1]).offset().top - window.innerHeight / 2}, 1000);
                $('html, body').animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
                i = result.length - 1;
            }
            showMessage({content: "show previous hit"});
        } else {
            showMessage({title: "Attention!", content: "no match found"});
        }
    })
);

/**
 * cancel searching
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelSearchState", function () {
        $("body").unmark();
    })
);
