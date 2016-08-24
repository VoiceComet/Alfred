/**
 * module to interact with videos
 */
addModule(new Module("videoModule", function () {
    /**
     * state for interacting with videos
     */
    var objectState = new State("ObjectState");
    objectState.init = function() {
        notify("entered object state");
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
     * show next objects
     */
    var nextObjects = new Action("nextObjects", 0, objectState);
    nextObjects.addCommand(new Command("next", 0));
    nextObjects.act = function () {
        callContentScriptMethod("nextObjects", {});
    };
    objectState.addAction(nextObjects);

    /**
     * show previous objects
     */
    var prevObjects = new Action("previousObjects", 0, objectState);
    prevObjects.addCommand(new Command("previous", 0));
    prevObjects.act = function () {
        callContentScriptMethod("previousObjects", {});
    };
    objectState.addAction(prevObjects);
}));
