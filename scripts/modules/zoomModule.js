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
            say("I stopped zooming");
        };
    };

    /**
     * function for smooth zooming
     * @param {Number} zoomFactor - current zoom
     * @param {Number} i - start for i
     * @param {String} operator - (+ or -)
     */
    function newZoom (operator, zoomFactor, i) {
        setTimeout(function () {
            // zoom in
            if (operator === "+") {
                if (zoomFactor < 1 && zoomFactor >= 0.5) {
                    if (zoomFactor < 0.75) {
                        chrome.tabs.setZoom(zoomFactor + ((zoomFactor/ 2) * i * 0.02));
                        i++;
                        if (i < 51) {
                            newZoom("+", zoomFactor, i);
                        }
                    } else {
                        chrome.tabs.setZoom(zoomFactor + ((zoomFactor/ 3) * i * 0.02));
                        i++;
                        if (i < 51) {
                            newZoom("+", zoomFactor, i);
                        }
                    }
                } else if (zoomFactor >= 3.9) {
                    chrome.tabs.setZoom(zoomFactor + ((zoomFactor /4) * i * 0.02));
                    i++;
                    if (i < 51) {
                        newZoom("+", zoomFactor, i);
                    }
                } else {
                    chrome.tabs.setZoom(zoomFactor + (zoomFactor * i * 0.02));
                    i++;
                    if (i < 51) {
                        newZoom("+", zoomFactor, i);
                    }
                }
            // zoom out
            } else {
                if (zoomFactor > 4) {
                    chrome.tabs.setZoom(zoomFactor - ((zoomFactor / 5) * i * 0.02));
                    i++;
                    if (i < 51) {
                        newZoom("-", zoomFactor, i);
                    }
                } else if (zoomFactor > 0.25) {
                    if(zoomFactor > 1) {
                        chrome.tabs.setZoom(zoomFactor - ((zoomFactor / 2) * i * 0.02));
                        i++;
                        if (i < 51) {
                            newZoom("-", zoomFactor, i);
                        }
                    } else {
                        chrome.tabs.setZoom(zoomFactor - (i * 0.00625));
                        i++;
                        if (i < 41) {
                            newZoom("-", zoomFactor, i);
                        }
                    }
                } else {
                    notify("Zooming out isn't possible");
                    say("I cannot zoom out");
                }
            }
        }, 20);
    }

    /**
     * function for checking if max zoom level is reached
     * @param {String} ContentScriptMethod - name of ScriptMethod which should run
     */
    var zoomIn = function (ContentScriptMethod) {
        chrome.tabs.getZoom(function (zoomFactor) {
            // check if max zoom is reached
            if(zoomFactor >= 4.9) {
                notify("reached max zoom");
                say("The maximal level of zooming is reached");
            } else{
                setTimeout(newZoom("+", zoomFactor, 1), 1000);
                callContentScriptMethod(ContentScriptMethod, {});
            }
        });
    };

    /**
     * function to reset zoom
     * @param {Number} zoomFactor - current zoom
     * @param {Number} i - start for i
     */
    var resetZoom = function (zoomFactor, i) {
      setTimeout(function () {
          if (zoomFactor > 1 && zoomFactor - (zoomFactor * i * 0.02) >= 0.9999) {
              chrome.tabs.setZoom(zoomFactor - (zoomFactor * i * 0.02));
              i++;
              resetZoom(zoomFactor, i);
          } else if(zoomFactor < 1 && zoomFactor + (zoomFactor * i * 0.02) <= 1.0009) {
              chrome.tabs.setZoom(zoomFactor + (zoomFactor * i * 0.02));
              i++;
              resetZoom(zoomFactor, i);
          } else {
              notify("Zoom is already reseted");
              say("The zoom is already reseted");
          }
      }, 20)
    };

    /**
     * start zooming in
     * @type {Action}
     */
    var startZooming = new Action("start zooming", 0, zoomState);
    startZooming.addCommand(new Command("test", 0));
    startZooming.act = function() {
        callContentScriptMethod("startZooming", {});
    };
    this.addAction(startZooming);


    /**
     * zoom in first sector
     * @type {Action}
     */
    var first = new Action("first", 0, zoomState);
    first.addCommand(new Command("1", 0));
    first.act = function () {
        zoomIn("zoomFirstSector");
    };
    zoomState.addAction(first);

    /**
     * zoom in second sector
     * @type {Action}
     */
    var second = new Action("second", 0, zoomState);
    second.addCommand(new Command("2", 0));
    second.act = function() {
        zoomIn("zoomSecondSector")
    };
    zoomState.addAction(second);

    /**
     * zoom in third sector
     * @type {Action}
     */
    var third = new Action("third", 0, zoomState);
    third.addCommand(new Command("3", 0));
    third.act = function() {
        zoomIn("zoomThirdSector")
    };
    zoomState.addAction(third);

    /**
     * zoom in fourth sector
     * @type {Action}
     */
    var fourth = new Action("fourth", 0, zoomState);
    fourth.addCommand(new Command("4", 0));
    fourth.act = function() {
        zoomIn("zoomFourthSector")
    };
    zoomState.addAction(fourth);

    /**
     * zoom out
     * @type {Action}
     */
    var out = new Action("out", 0, zoomState);
    out.addCommand(new Command("zoom out", 0));
    out.act = function() {
      chrome.tabs.getZoom(function (zoomFactor) {
          newZoom("-", zoomFactor, 1);
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
            resetZoom(zoomFactor, 1);
        });
    };
    zoomState.addAction(reset);

}));
