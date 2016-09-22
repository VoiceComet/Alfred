/**
 * csm for zooming a page
 */

/**
 * start zooming
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomIn", function() { //function(params)
        // load grid
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
        $("html, body")
            .animate({scrollTop: scrollPosVertical}, "slow")
            .animate({scrollLeft: scrollPosHorizontal}, "slow");
        showMessage({content: "Zoom into first sector"});
    })
);

/**
 * zoom into the second sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomSecondSector", function () {
        var scrollPosVertical = window.scrollY;
        var scrollPosHorizontal = window.scrollX;
        $("html, body")
            .animate({scrollTop: scrollPosVertical}, "slow")
            .animate({scrollLeft: scrollPosHorizontal + window.innerWidth}, "slow");
        showMessage({content: "Zoom into second sector"});
    })
);

/**
 * zoom into the third sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomThirdSector", function () {
        var scrollPosVertical = window.scrollY;
        var scrollPosHorizontal = window.scrollX;
        $("html, body")
            .animate({scrollTop: scrollPosVertical + window.innerHeight}, "slow")
            .animate({scrollLeft: scrollPosHorizontal}, "slow");
        showMessage({content: "Zoom into third sector"});
    })
);

/**
 * zoom into the fourth sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomFourthSector", function () {
        var scrollPosVertical = window.scrollY;
        var scrollPosHorizontal = window.scrollX;
        $("html, body")
            .animate({scrollTop: scrollPosVertical + window.innerHeight}, "slow")
            .animate({scrollLeft: scrollPosHorizontal + window.innerWidth}, "slow");
        showMessage({content: "Zoom into fourth sector"});
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
