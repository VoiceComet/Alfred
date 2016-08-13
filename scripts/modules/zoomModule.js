/**
 * Module for zooming
 */
addModule(new Module("zoomModule", function() {
    /**
     * State for zooming the page
     */
    var zoomState = new State("zoomState");
    zoomState.init = function () {
        notify("entered zoom state");
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelZoomState", {});
            notify("canceled zoom state");
        };
    };

    /**
     * start zooming in
     */
    var zoomIn = new Action("zoom in", 0, zoomState);
    zoomIn.addCommand(new Command("[^zoom &]?in", 0));
    zoomIn.act = function() {
        callContentScriptMethod("zoomIn", {});
    };
    this.addAction(zoomIn);


    /**
     * zoom in first sector
     */
    var first = new Action("first", 0, zoomState);
    first.addCommand(new Command("1", 0));
    first.act = function() {
        chrome.tabs.getZoom(function (zoomFactor) {
            if(zoomFactor >= 5) {
                notify("reached max zoom");
            } else{
                notify("zoom into first sector");
                var newZoom = zoomFactor * 2;
                chrome.tabs.setZoom(newZoom);
            }
        });
        callContentScriptMethod("zoomFirstSector", {});
    };
    zoomState.addAction(first);

    /**
     * zoom out
     */
    var out = new Action("out", 0, zoomState);
    out.addCommand(new Command("zoom out", 0));
    out.act = function() {
      notify("zoom out");
      chrome.tabs.getZoom(function (zoomFactor) {
        var newZoom = zoomFactor * 0.5;
        chrome.tabs.setZoom(newZoom);
      });
      callContentScriptMethod("zoomOut", {});
    };
    zoomState.addAction(out);

    /**
     * reset zoom
     */
    var reset = new Action("reset", 0, zoomState);
    reset.addCommand(new Command("reset zoom", 0));
    reset.act = function () {
        chrome.tabs.getZoom(function (zoomFactor) {
            // if zoomfactor is 1 do nothing else reset zoom to 0
            if(zoomFactor === 1.0) {
                notify("zoom is already reseted");
            } else {
                notify("reset zoom");
                chrome.tabs.setZoom(0);
            }
        });
    };
    zoomState.addAction(reset);
}));
