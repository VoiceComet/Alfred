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
        result = jQuery.makeArray($(".highlight:visible"));
        alert(result.length);
        /** //result = jQuery.makeArray(document.getElementsByClassName("highlight"));
        //alert(result.length);
        //var test = jQuery.makeArray($(".highlight:visible"));
        //alert(test.length);
        //var test = result[0].parentNode.style.getPropertyValue("overflow");
        var test1 = result[3];
        while(true) {
            if (test1.previousSibling.nodeType != 1) {
                test1 = test1.previousSibling;
            } else {
                return;
            }
        };
        alert(result[3].previousSibling.nodeType);
        var test = window.getComputedStyle(result[3]).getPropertyValue("overflow");
        alert(test);
        console.log(test);
        if (result.length > 0) {
            result[1].style.overflow = "visible";
        }
        var w = 0;
        for (var j = 0; j < result.length; j++) {
            for (var k = 0; k < test.length; k++) {
                if (test[k] == result[j]) {
                    w++
                    result.pop();
                }
            }
        }
        alert(w);
        alert(result.length);*/
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
