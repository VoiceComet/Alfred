/**
 * csm for interacting with links
 */
var links;
var i = 0;
/**
 * show all links
 */
addContentScriptMethod(
    new ContentScriptMethod("showLinks", function () {
        $("a").addClass("highlight");

        if (id != "") {
            hideMessage({id: id});
        }
        //if link is hidden on page remove class highlight
        $(".highlight:hidden").removeClass("highlight");
        $(".highlight").each(function () {
            if (window.getComputedStyle(this).getPropertyValue("visibility") === "hidden") {
                $(this).removeClass("highlight");
            }
        });

        links = jQuery.makeArray(document.getElementsByClassName("highlight"));

        if(links.length === 0) {
            showMessage({title: "Attention!", content: "couldn't find links"});
        } else {
            for (i = 0; i < links.length; i++) {
                if (window.scrollY <= $(links[i]).offset().top &&
                    window.scrollX <= $(links[i]).offset().left &&
                    $(links[i]).offset().top - window.innerHeight <= window.scrollY &&
                    $(links[i]).offset().left - window.innerWidth <= window.scrollY) {
                    links[i].style.backgroundColor = "rgb(255, 150, 50)";
                    $('html, body')
                        .animate({scrollTop: $(links[i]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(links[i]).offset().left - window.innerWidth / 2}, 1000);
                    id = showMessage({
                        content: "show all links",
                        time: 0,
                        cancelable: true,
                        commandLeft: "previous",
                        commandRight: "next",
                        infoCenter: "link " + (i + 1) + " of " + (links.length)
                    });
                    console.log(links[i]);
                    return;
                } else if (i + 1 >= links.length) {
                    i = 0;
                    links[0].style.backgroundColor = "rgb(255, 150, 50)";
                    $('html, body')
                        .animate({scrollTop: $(links[0]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(links[0]).offset().left - window.innerWidth / 2}, 1000);
                    id = showMessage({
                        content: "search for: <span style='background-color:yellowgreen'>" + parameter + "</span>",
                        time: 0,
                        cancelable: true,
                        commandLeft: "previous",
                        commandRight: "next",
                        infoCenter: "link " + (i + 1) + " of " + (links.length)
                    });
                    return;
                }
            }
        }
    })
);

/**
 * show next link
 */
addContentScriptMethod(
    new ContentScriptMethod("nextLink", function () {
        //highlights the next match
        if(links.length > 1) {
            if (i < links.length - 1) {
                links[i].style.backgroundColor = "yellow";
                links[i + 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(links[i + 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[i + 1]).offset().left - window.innerWidth / 2}, 1000);
                i++;
                //reached last element -> continue at 0
            } else {
                links[i].style.backgroundColor = "yellow";
                links[0].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(links[0]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[0]).offset().left - window.innerWidth / 2}, 1000);
                i = 0;
            }
            updateMessage({
                id: id,
                content: "show all links",
                time: 0,
                cancelable: true,
                commandLeft: "previous",
                commandRight: "next",
                infoCenter:"link " + (i + 1) + " of " + (links.length)
            });
            showMessage({content: "show next link"});
        } else {
            showMessage({title: "Attention!", content: "no link found"});
        }
    })
);

/**
 * show previous links
 */
addContentScriptMethod(
    new ContentScriptMethod("previousLink", function () {
        if(links.length > 1) {
            if (i > 0) {
                links[i].style.backgroundColor = "yellow";
                links[i - 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(links[i - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[i - 1]).offset().left - window.innerWidth / 2}, 1000);
                i--;
                //reached first element -> continue with last
            } else {
                links[i].style.backgroundColor = "yellow";
                links[links.length - 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(links[links.length - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[0]).offset().left - window.innerWidth / 2}, 1000);
                i = result.length - 1;
            }
            updateMessage({
                id: id,
                content: "show all links",
                time: 0,
                cancelable: true,
                commandLeft: "previous",
                commandRight: "next",
                infoCenter:"link " + (i + 1) + " of " + (links.length)
            });
            showMessage({content: "show previous link"});
        } else {
            showMessage({title: "Attention!", content: "no link found"});
        }
    })
);

/**
 * go to certain link
 */
addContentScriptMethod(
    new ContentScriptMethod("certainLink", function (params) {
        if (params.toString() === "one") {
            params = 1;
        }
        if (params <= links.length) {
            links[i].style.backgroundColor = "yellow";
            links[params - 1].style.backgroundColor = "rgb(255, 150, 50";
            $('html, body')
                .animate({scrollTop: $(links[params - 1]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(links[params - 1]).offset().left - window.innerWidth / 2}, 1000);
            i = params - 1;
            updateMessage({
                id: id,
                content: "show all links",
                time: 0,
                cancelable: true,
                commandLeft: "previous",
                commandRight: "next",
                infoCenter:"link " + (i + 1) + " of " + (links.length)
            });
            showMessage({content: "show link " + params});
        } else {
            showMessage({title: "Attention!", content: "there is no link <span style='background-color:lightcoral'>" + params + "</span>"});
        }
    })
);

/**
 * open link
 */
addContentScriptMethod(
    new ContentScriptMethod("openLink", function () {
        showMessage({content:"canceled link state"});
        hideMessage({id: id});
        window.location = links[i];
    })
);

/**
 * open link in new tab
 */
addContentScriptMethod(
    new ContentScriptMethod("openLinkNewTab", function () {
        showMessage({content:"canceled link state"});
        hideMessage({id: id});
        window.open(links[i]);
    })
);


/**
 * cancel link state
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelLinkState" , function () {
        hideMessage({id: id});
    })
);