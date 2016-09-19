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
     * function for checking if max zoom level is reached
     * @param {String} ContentScriptMethod - name of ScriptMethod which should run
     */
    var CheckZoomLevel = function (ContentScriptMethod) {
        chrome.tabs.getZoom(function (zoomFactor) {
            if(zoomFactor >= 4.9) {
                notify("reached max zoom");
            } else if (zoomFactor >= 3.9) {
                chrome.tabs.setZoom(5);
                callContentScriptMethod(ContentScriptMethod, {});
                notify("maximal zoom reached");
            } else{
                var newZoom = zoomFactor * 2;
                chrome.tabs.setZoom(newZoom);
                callContentScriptMethod(ContentScriptMethod, {});
            }
        });
    };

    /**
     * start zooming in
     * @type {Action}
     */
    var zoomIn = new Action("zoom in", 0, zoomState);
    zoomIn.addCommand(new Command("zoom in", 0));
    zoomIn.act = function() {
        callContentScriptMethod("zoomIn", {});
    };
    this.addAction(zoomIn);


    /**
     * zoom in first sector
     * @type {Action}
     */
    var first = new Action("first", 0, zoomState);
    first.addCommand(new Command("1", 0));
    first.act = function () {
        CheckZoomLevel("zoomFirstSector");
    };
    zoomState.addAction(first);

    /**
     * zoom in second sector
     * @type {Action}
     */
    var second = new Action("second", 0, zoomState);
    second.addCommand(new Command("2", 0));
    second.act = function() {
        CheckZoomLevel("zoomSecondSector")
    };
    zoomState.addAction(second);

    /**
     * zoom in third sector
     * @type {Action}
     */
    var third = new Action("third", 0, zoomState);
    third.addCommand(new Command("3", 0));
    third.act = function() {
        CheckZoomLevel("zoomThirdSector")
    };
    zoomState.addAction(third);

    /**
     * zoom in fourth sector
     * @type {Action}
     */
    var fourth = new Action("fourth", 0, zoomState);
    fourth.addCommand(new Command("4", 0));
    fourth.act = function() {
        CheckZoomLevel("zoomFourthSector")
    };
    zoomState.addAction(fourth);

    /**
     * zoom out
     * @type {Action}
     */
    var out = new Action("out", 0, zoomState);
    out.addCommand(new Command("zoom out", 0));
    out.act = function() {
      notify("zoom out");
      chrome.tabs.getZoom(function (zoomFactor) {
          if (zoomFactor >= 4.9) {
              chrome.tabs.setZoom(4);
          } else {
              var newZoom = zoomFactor / 2;
              chrome.tabs.setZoom(newZoom);
          }
      });
    };
    zoomState.addAction(out);

    /**
     * reset zoom
     * @type {Action}
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
