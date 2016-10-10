/**
 * module to interact with videos
 */
addModule(new Module("videoModule", function () {
    /**
     * state for interacting with videos
     */
    var videoState = new State("videoState");
    videoState.init = function() {
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelVideoState", {});
            say("I stopped interacting with videos");
        };
    };

    /**
     * show all videos
     */
    var showVideos = new Action("showVideos", 0, videoState);
    showVideos.addCommand(new Command("show videos", 0));
    showVideos.act = function () {
        callContentScriptMethod("showVideos", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    this.addAction(showVideos);
    videoState.addAction(showVideos);

    /**
     * show next video
     */
    var nextVideo = new Action("nextVideo", 0, videoState);
    nextVideo.addCommand(new Command("next", 0));
    nextVideo.act = function () {
        callContentScriptMethod("nextVideo", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    videoState.addAction(nextVideo);

    /**
     * show previous video
     */
    var previousVideo = new Action("previousVideo", 0, videoState);
    previousVideo.addCommand(new Command("previous", 0));
    previousVideo.act = function () {
        callContentScriptMethod("previousVideo", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    videoState.addAction(previousVideo);

    /**
     * play video
     */
    var playVideo = new Action("playVideo", 0, videoState);
    playVideo.addCommand(new Command("play Video", 0));
    playVideo.act = function () {
        callContentScriptMethod("playVideo", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    }
    videoState.addAction(playVideo);


}));
