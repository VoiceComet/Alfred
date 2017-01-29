/**
 * module to interact with videos
 */
addModule(new Module("videoModule", function () {
    /**
     * state for interacting with videos
     */
    var videoState = new State("videoState");
    videoState.init = function() {
        this.cancelAction.cancelAct = function() {
            callContentScriptMethod("cancelVideoState", {});
            say("I stopped interacting with videos");
        };
    };

    /**
     * show all videos
     */
    var watchVideos = new Action("watchVideos", 0, videoState);
    watchVideos.act = function () {
        callContentScriptMethod("watchVideos", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    this.addAction(watchVideos);
    videoState.addAction(watchVideos);

    /**
     * show next video
     */
    var nextVideo = new Action("next", 0, videoState);
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
    var previousVideo = new Action("previous", 0, videoState);
    previousVideo.act = function () {
        callContentScriptMethod("previousVideo", {}, function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    videoState.addAction(previousVideo);

    /**
     * watch certain video
     */
    var certainVideo = new Action("certainVideo", 1, videoState);
    certainVideo.act = function (arguments) {
        callContentScriptMethod("certainVideo", arguments[0], function (params) {
            if (params.content) {
                say(params.content);
            }
        });
    };
    videoState.addAction(certainVideo);

    /**
     * play video
     */
    var playVideo = new Action("playVideo", 0, videoState);
    playVideo.act = function () {
        callContentScriptMethod("playVideo", {});
    };
    videoState.addAction(playVideo);

    /**
     * stop video
     */
    var stopVideo = new Action("stopVideo", 0, videoState);
    stopVideo.act = function () {
        callContentScriptMethod("stopVideo", {});
    };
    videoState.addAction(stopVideo);

    /**
     * click video
     */
    var clickVideo = new Action("clickVideo", 0, videoState);
    clickVideo.act = function () {
        callContentScriptMethod("clickVideo", {});
    };
    videoState.addAction(clickVideo);

    /**
     * mute video
     */
    var muteVideo = new Action("muteVideo", 0, videoState);
    muteVideo.act = function () {
        callContentScriptMethod("muteVideo", {});
    };
    videoState.addAction(muteVideo);

    /**
     * unmute video
     */
    var unmuteVideo = new Action("unmuteVideo", 0, videoState);
    unmuteVideo.act = function () {
        callContentScriptMethod("unmuteVideo", {});
    };
    videoState.addAction(unmuteVideo);

    /**
     * jump forward in video
     */
    var jumpForwardVideo = new Action("jumpForwardVideo", 0, videoState);
    jumpForwardVideo.act = function () {
        callContentScriptMethod("jumpForwardVideo", {});
    };
    videoState.addAction(jumpForwardVideo);

    /**
     * jump backwards in video
     */
    var jumpBackwardsVideo = new Action("jumpBackwardsVideo", 0, videoState);
    jumpBackwardsVideo.act = function () {
        callContentScriptMethod("jumpBackwardsVideo", {});
    };
    videoState.addAction(jumpBackwardsVideo);

    /**
     * jump to certain time
     */
    var jumpCertainVideo = new Action("jumpCertainVideo", 1, videoState);
    jumpCertainVideo.act = function (arguments) {
        callContentScriptMethod("jumpCertainVideo", arguments[0]);
    };
    videoState.addAction(jumpCertainVideo);

    /**
     * increase volume
     */
    var increaseVolume = new Action("increaseVolume", 0, videoState);
    increaseVolume.act = function () {
        callContentScriptMethod("increaseVolume", {});
    };
    videoState.addAction(increaseVolume);

    /**
     * decrease volume
     */
    var decreaseVolume = new Action("decreaseVolume", 0, videoState);
    decreaseVolume.act = function () {
        callContentScriptMethod("decreaseVolume", {});
    };
    videoState.addAction(decreaseVolume);

    /**
     * set volume
     */
    var setVolumeVideo = new Action("setVolumeVideo", 1, videoState);
    setVolumeVideo.act = function (arguments) {
        callContentScriptMethod("setVolumeVideo", arguments[0]);
    };
    videoState.addAction(setVolumeVideo);

}));
