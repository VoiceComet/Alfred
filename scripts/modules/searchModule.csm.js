/**
 * csm for searching for expressions
 */
var result = [];
var i = 0;
var id = "";
var parameter;
var oldId = true;

/**
 * search for an expression
 */
addContentScriptMethod(
    new ContentScriptMethod("search", function (params) {
        //unmark elements from last search
        parameter = params.toString();
        var searched = new RegExp(parameter, "gmi");
        $("body")
            .unmark()
            .markRegExp(searched, {
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
            if (oldId) {
                showMessage({content: translate("notifyCouldNotFindX").format([parameter]), centered: true});
            } else {
                updateMessage({
                    id: id,
                    content: translate("notifyCouldNotFindX").format([parameter]),
                    centered: true
                });
                oldId = true;
            }
            return({content: translate("sayCouldNotFindX").format([parameter]), followingState:"globalCommonState"});
        } else {
            for (i = 0; i < result.length; i++) {
				var message = {
					content: translate("searchForX").format(["<span style='font-weight: bold'>" + parameter + "</span>"]),
					time: 0,
					cancelable: true,
					commandLeft: translate("previous"),
					commandRight: translate("next"),
					infoCenter: translate("matchXOfY").format([i + 1, result.length])
				};
                if (window.scrollY <= $(result[i]).offset().top &&
                    window.scrollX <= $(result[i]).offset().left &&
                    $(result[i]).offset().top - window.innerHeight <= window.scrollY &&
                    $(result[i]).offset().left - window.innerWidth <= window.scrollY) {
                    result[i].style.backgroundColor = "rgb(255, 150, 50)";
                    $('html, body')
                        .animate({scrollTop: $(result[i]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(result[i]).offset().left - window.innerWidth / 2}, 1000);
                    if (oldId) {
                        id = showMessage(message);
                        oldId = false;
                    } else {
						message.id = id;
                        //noinspection JSCheckFunctionSignatures
						updateMessage(message);
                    }
                    if (result.length > 1) {
                        return({content: translate("foundXMatchesForYYouAreOnMatchZ").format([result.length, parameter, i + 1])})
                    } else {
                        return({content: translate("foundOneMatchForX").format([parameter])})
                    }
                } else if (i + 1 >= result.length) {
                    i = 0;
                    result[0].style.backgroundColor = "rgb(255, 150, 50)";
                    $('html, body')
                        .animate({scrollTop: $(result[0]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);

                    if (oldId) {
                        id = showMessage(message);
                        oldId = false;
                    } else {
						message.id = id;
						//noinspection JSCheckFunctionSignatures
						updateMessage(message);
                    }
					if (result.length > 1) {
						return({content: translate("foundXMatchesForYYouAreOnMatchZ").format([result.length, parameter, i + 1])})
					} else {
						return({content: translate("foundOneMatchForX").format([parameter])})
					}
                }
            }
        }
    })
);

/**
 * show next match
 */
addContentScriptMethod(
    new ContentScriptMethod("nextMatch", function () {
        //highlights the next match
        if(result.length > 1) {
            if (i < result.length - 1) {
                result[i].style.backgroundColor = "yellow";
                result[i + 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[i + 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[i + 1]).offset().left - window.innerWidth / 2}, 1000);
                i++;
                //reached last element -> continue at 0
            } else {
                result[i].style.backgroundColor = "yellow";
                result[0].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[0]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
                i = 0;
            }
            updateMessage({
				id: id,
				content: translate("searchForX").format(["<span style='font-weight: bold'>" + parameter + "</span>"]),
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("matchXOfY").format([i + 1, result.length])
			});
            return({content: translate("youAreOnMatchXOfY").format([i + 1, result.length])});
        } else {
            showMessage({content: translate("notifyNoMatchFound"), centered: true});
            return({content: translate("foundOneMatchForX").format([parameter])});
        }
    })
);

/**
 * show previous match
 */
addContentScriptMethod(
    new ContentScriptMethod("previousMatch", function () {
        if(result.length > 1) {
            if (i > 0) {
                result[i].style.backgroundColor = "yellow";
                result[i - 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[i - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[i - 1]).offset().left - window.innerWidth / 2}, 1000);
                i--;
                //reached first element -> continue with last
            } else {
                result[i].style.backgroundColor = "yellow";
                result[result.length - 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[result.length - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
                i = result.length - 1;
            }
            updateMessage({
				id: id,
				content: translate("searchForX").format(["<span style='font-weight: bold'>" + parameter + "</span>"]),
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("matchXOfY").format([i + 1, result.length])
			});
			return({content: translate("youAreOnMatchXOfY").format([i + 1, result.length])});
        } else {
			showMessage({content: translate("notifyNoMatchFound"), centered: true});
			return({content: translate("foundOneMatchForX").format([parameter])});
        }
    })
);

/**
 * go to certain match
 */
addContentScriptMethod(
    new ContentScriptMethod("certainMatch", function (params) {
        if (params.toString() === "one") {
            params = 1;
        }
        if (params <= result.length) {
            result[i].style.backgroundColor = "yellow";
            result[params - 1].style.backgroundColor = "rgb(255, 150, 50";
            $('html, body')
                .animate({scrollTop: $(result[params - 1]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(result[params - 1]).offset().left - window.innerWidth / 2}, 1000);
            i = params - 1;
            updateMessage({
				id: id,
				content: translate("searchForX").format(["<span style='font-weight: bold'>" + parameter + "</span>"]),
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("matchXOfY").format([i + 1, result.length])
			});
			return({content: translate("youAreOnMatchXOfY").format([i + 1, result.length])});
        } else {
            showMessage({content: translate("notifyThereIsNoMatchX").format([params]), centered: true});
            return({content: translate("sayThereIsNoMatchXForY").format([params, parameter])});
        }
    })
);

/**
 * cancel searching
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelSearchState", function () {
        $("body").unmark();
        hideMessage({id: id});
        oldId = true;
        id = "";
    })
);
