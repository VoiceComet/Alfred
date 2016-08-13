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
