/**
 * Module for zooming
 */
addModule(new Module("zoomModule", function() {
    /**
     * State for zooming the page
     */
    var zoomInState = new State("zoomInState");
    zoomInState.init = function () {
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelZoomState", {});
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
        //setTimeout(function () {
        // zoom in
        zoomFactor = Math.round(zoomFactor * 100) / 100.0;
        var newZoomFactor;
        if (operator === "+") {
            //zoom 0.25
            if (zoomFactor >= 0.25 && zoomFactor < 0.5) {
                newZoomFactor = zoomFactor + zoomFactor * i * 0.04;
            //zoom 0.5
            } else if (zoomFactor >= 0.5 && zoomFactor < 0.75) {
                newZoomFactor = zoomFactor + (zoomFactor / 2) * i * 0.04;
            //zoom 0.75
            } else if (zoomFactor >= 0.75 && zoomFactor < 1) {
                newZoomFactor = zoomFactor + (zoomFactor/ 3) * i * 0.04;
            // zoom 1 or 2
            } else if (zoomFactor >= 1 && zoomFactor < 4) {
                newZoomFactor = zoomFactor + zoomFactor * i * 0.04;
            // zoom 4
            } else {
                newZoomFactor = zoomFactor + (zoomFactor / 4) * i * 0.04;
            }
        // zoom out
        } else {
            //zoom 0.5
            if (zoomFactor >= 0.5 && zoomFactor < 0.75) {
                newZoomFactor = zoomFactor - (zoomFactor / 2) * i * 0.04;
            //zoom 0.75
            } else if (zoomFactor >= 0.75 && zoomFactor < 1) {
                newZoomFactor = zoomFactor - (zoomFactor / 3) * i * 0.04;
            //zoom 1
            } else if (zoomFactor >= 1 && zoomFactor < 2) {
                newZoomFactor = zoomFactor - (zoomFactor / 4) * i * 0.04;
            //zoom 2 and 4
            } else if (zoomFactor >= 2 && zoomFactor < 5) {
                newZoomFactor = zoomFactor - (zoomFactor / 2) * i * 0.04;
            //zoom 5
            } else if (zoomFactor >= 5) {
                newZoomFactor = zoomFactor - (zoomFactor / 5) * i * 0.04;
            } else {
                notify("Zooming out isn't possible");
                say("I cannot zoom out");
            }
        }
        chrome.tabs.setZoom(newZoomFactor, function () {
            i++;
            if (i < 26) {
                newZoom(operator, zoomFactor, i);
            }
        });
       // }, 20);
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
          if (zoomFactor != 1) {
              if (zoomFactor - (zoomFactor * i * 0.02) > 0.99) {
                  chrome.tabs.setZoom(zoomFactor - (zoomFactor * i * 0.02));
                  i++;
                  resetZoom(zoomFactor, i);
              } else if (zoomFactor + (zoomFactor * i * 0.02) <= 1) {
                  chrome.tabs.setZoom(zoomFactor + (zoomFactor * i * 0.02));
                  i++;
                  resetZoom(zoomFactor, i);
              } else {
                  chrome.tabs.setZoom(1);
                  i++;
              }
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
    var startZooming = new Action("start zooming", 0, zoomInState);
    startZooming.addCommand(new Command("zoom in", 0));
    startZooming.act = function() {
        callContentScriptMethod("startZooming", {});
    };
    this.addAction(startZooming);


    /**
     * zoom in first sector
     * @type {Action}
     */
    var first = new Action("first", 0, globalCommonState);
    first.addCommand(new Command("1", 0));
    first.act = function () {
        callContentScriptMethod("cancelZoomState", {});
        zoomIn("zoomFirstSector");
    };
    zoomInState.addAction(first);

    /**
     * zoom in second sector
     * @type {Action}
     */
    var second = new Action("second", 0, globalCommonState);
    second.addCommand(new Command("2", 0));
    second.act = function() {
        callContentScriptMethod("cancelZoomState", {});
        zoomIn("zoomSecondSector")
    };
    zoomInState.addAction(second);

    /**
     * zoom in third sector
     * @type {Action}
     */
    var third = new Action("third", 0, globalCommonState);
    third.addCommand(new Command("3", 0));
    third.act = function() {
        callContentScriptMethod("cancelZoomState", {});
        zoomIn("zoomThirdSector")
    };
    zoomInState.addAction(third);

    /**
     * zoom in fourth sector
     * @type {Action}
     */
    var fourth = new Action("fourth", 0, globalCommonState);
    fourth.addCommand(new Command("4", 0));
    fourth.act = function() {
        callContentScriptMethod("cancelZoomState", {});
        zoomIn("zoomFourthSector")
    };
    zoomInState.addAction(fourth);

    /**
     * zoom out
     * @type {Action}
     */
    var zoomOut = new Action("zoomOut", 0, globalCommonState);
    zoomOut.addCommand(new Command("zoom out", 0));
    zoomOut.act = function() {
      chrome.tabs.getZoom(function (zoomFactor) {
          newZoom("-", zoomFactor, 1);
      });
    };
    this.addAction(zoomOut);

    /**
     * reset zoom
     * @type {Action}
     */
    var reset = new Action("reset", 0, globalCommonState);
    reset.addCommand(new Command("reset zoom", 0));
    reset.act = function () {
        chrome.tabs.getZoom(function (zoomFactor) {
            resetZoom(zoomFactor, 1);
        });
    };
    this.addAction(reset);

}));
