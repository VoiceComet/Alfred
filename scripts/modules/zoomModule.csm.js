/**
 * csm for zooming a page
 */

/**
 * zoom into the first sector
 */
addContentScriptMethod(
    new ContentScriptMethod("zoomFirstSector", function() {
        d3.behavior.zoom()
            .center([innerWidth / 4, innerHeight / 4])
            .scaleExtent([1, 10]);
    })
);
