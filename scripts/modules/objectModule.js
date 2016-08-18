/**
 * module to interact with videos
 */
addModule(new Module("videoModule", function () {
    /**
     * state for interacting with videos
     */
    var objectState = new State("ObjectState");
    objectState.init = function() {
        notify("entered video state");
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelObjectState", {});
            notify("canceled object state");
        };
    };

    /**
     * show all videos
     */
    var showVideos = new Action("showVideos", 0, objectState);
    showVideos.addCommand(new Command("show videos", 0));
    showVideos.act = function () {
        callContentScriptMethod("showVideos", {});
    };
    this.addAction(showVideos);
    objectState.addAction(showVideos);

    /**
     * show all images
     */
    var showImages = new Action("showImages", 0, objectState);
    showImages.addCommand(new Command("show images", 0));
    showImages.act = function () {
        callContentScriptMethod("showImages", {});
    };
    this.addAction(showImages);
    objectState.addAction(showImages);

    /**
     * scroll down
     */
    var scrollDownDiv = new Action("scrollDownDiv",0 , objectState);
    scrollDownDiv.addCommand(new Command("[^scroll &]?down", 0));
    scrollDownDiv.act = function () {
        callContentScriptMethod("scrollDownDiv", {});
    };
    objectState.addAction(scrollDownDiv);
}));
