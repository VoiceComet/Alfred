/**
 * module to interact with images
 */
addModule(new Module("imageModule", function () {

    /**
     * state to interact with images
     */
    var imageState = new State("ImageState");
    imageState.init = function () {
        this.cancelAction.act = function () {
            callContentScriptMethod("cancelImageState", {});
            say("I stopped interacting with images");
        };
    };

    /**
     * show all images
     */
    var showImages = new Action("showImages", 0, imageState);
    showImages.addCommand(new Command("show images", 0));
    showImages.act = function () {
        callContentScriptMethod("showImages", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    this.addAction(showImages);
    imageState.addAction(showImages);

    /**
     * show next images
     */
    var nextImages = new Action("nextImages", 0, imageState);
    nextImages.addCommand(new Command("next", 0));
    nextImages.act = function () {
        callContentScriptMethod("nextImages", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    imageState.addAction(nextImages);

    /**
     * show previous images
     */
    var previousImages = new Action("previousImages", 0, imageState);
    previousImages.addCommand(new Command("previous", 0));
    previousImages.act = function () {
        callContentScriptMethod("previousImages", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    imageState.addAction(previousImages);

    /**
     * go to certain page of images
     */
    var certainImagePage = new Action("certainImagePage", 1, imageState);
    certainImagePage.addCommand(new Command("go to page (.*)", 1));
    certainImagePage.act = function (arguments) {
        callContentScriptMethod("certainImagePage", arguments[0], function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    imageState.addAction(certainImagePage);
}));