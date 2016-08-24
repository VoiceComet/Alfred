/**
 * csm for zooming a page
 */

/**
 * start zooming
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomIn", function() { //function(params)
        $("<div></div>", {id: "zoomUIDIV"})
            .appendTo($("body"))
            .load(chrome.extension.getURL("zoomUI.html"), function() {
                $("#zoomUIGrid").attr("src",chrome.extension.getURL("images/grid.png"));
            });
    })
);

/**
 * zoom into the first sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomFirstSector", function() {
        window.document.body.style.scalable = "no";
        var scrollPosVertical = window.scrollY;
        var scrollPosHorizontal = window.scrollX;
        $("html, body").animate({scrollTop: scrollPosVertical}, {scrollLeft: scrollPosHorizontal}, "slow");
        //$("#first").zoomTo({targetsize: 0.085, closeclick: true});
    })
);

/**
 * zoom into the second sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomSecondSector", function () {
        var scrollPosVertical = window.scrollY;
        var scrollPosHorizontal = window.scrollX;
        $("html, body").animate({scrollTop: scrollPosVertical}, "slow");
        $("html, body").animate({scrollLeft: scrollPosHorizontal + window.innerWidth / 2}, "slow");

    })
);

/**
 * zoom into the third sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomThirdSector", function () {
        var scrollPosVertical = window.scrollY;
        var scrollPosHorizontal = window.scrollX;
        $("html, body").animate({scrollTop: scrollPosVertical + window.innerHeight / 2}, {scrollLeft: scrollPosHorizontal}, "slow");
    })
);

/**
 * zoom into the fourth sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomFourthSector", function () {
        var scrollPosVertical = window.scrollY;
        var scrollPosHorizontal = window.scrollX;
        $("html, body").animate({scrollTop: scrollPosVertical}, "slow");
        $("html, body").animate({scrollLeft: scrollPosHorizontal + window.innerWidth / 2}, "slow");

    })
);

/**
 * zoom out
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomOut", function () {
        $("#first").click();
    })
);

/**
 * cancel zooming
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelZoomState", function () {
        $("#zoomUIDIV").remove();
    })
);
