/**
 * Module for zooming
 */
addModule(new Module("zoomModule", function() {

    /**
     * zoom in first sector
     */
    var first = new Action("first", 0, globalCommonState);
    first.addCommand(new Command("first", 0));
    first.act = function() {
        notify("Zoom into first sector");
        callContentScriptMethod("zoomFirstSector", {});
    };
    zoomState.addAction(first);
}));
