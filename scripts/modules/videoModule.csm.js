/**
 * csm for interacting with objects
 */
//current number of video
var i = 0;
var videos = [];
var id = "";

/**
 * show all videos
 */
addContentScriptMethod(
    new ContentScriptMethod("watchVideos", function () {
        videos = [];
        i = 0;
        var html5 = jQuery.makeArray(document.getElementsByTagName("video"));
        for (var j = 0; j < html5.length; j++) {
            if (html5[j].width >= 0 && html5[j].height >= 0) {
                videos.push(html5[j]);
            }
        }
        var iframeVideo = jQuery.makeArray(document.getElementsByTagName("iframe"));
        for (var k = 0; k < iframeVideo.length; k++) {
            if (iframeVideo[k].width > 0 && iframeVideo[k].height > 0) {
                videos.push(iframeVideo[k]);
            }
        }
        var objectTag = jQuery.makeArray(document.getElementsByTagName("object"));
        for (var m = 0; m < objectTag.length; m++) {
            var objectParams = jQuery.makeArray(objectTag[i].getElementsByTagName("param"));
            for (var p = 0; p < objectParams.length; p++) {
                var name = objectParams[p].getAttribute("name").toLowerCase();
                if (name) {
                    if (name == "flashvars" || name == "movie") {
                        videos.push(objectTag[m]);
                        return;
                    }
                }
            }
        }
        if (videos.length > 0) {
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
            id = showMessage({
                content: "Show videos",
                commandRight: "next",
                cancelable: true,
                infoCenter: "video " + (i + 1) + " of " + videos.length,
                time: 0
            });
            if (videos.length > 1) {
                return({content: "I found " + videos.length + " videos on this page. You watch video one"});
            } else {
                return({content: "I found one video on this page"});
            }
        } else {
            showMessage({content: "No videos found on this page", centered: true});
            return({content: "I found no videos on this page"});
        }
    })
);

/**
 * show next video
 */
addContentScriptMethod(
    new ContentScriptMethod("nextVideo", function () {
        if (i + 1 < videos.length) {
            i++;
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
            if (i + 1 < videos.length) {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            }
            return({content: "You watch video " + (i + 1)});
        } else {
            showMessage({content: "This is the last video", centered: true});
            return({content: "This is the last video"});
        }
    })
);

/**
 * show previous video
 */
addContentScriptMethod(
    new ContentScriptMethod("previousVideo", function () {
        if (i - 1 >= 0) {
            i--;
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
            if (i - 1 > -1) {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            }
            return({content: "You watch video " + (i + 1)});
        } else {
            showMessage({content: "This is the first video", centered: true});
            return({content: "This is the first video"});
        }
    })
);

/**
 * watch certain video
 */
addContentScriptMethod(
    new ContentScriptMethod("certainVideo", function (params) {
        if (params === "one") {
            params = 1;
        }
        var newVideo = parseInt(params);
        if (videos.length < newVideo || 0 >= newVideo || isNaN(newVideo)) {
                showMessage({content: "There is no video " + params, centered: true});
                return({content: "There is no video " + params});
        } else if (i === newVideo - 1) {
            showMessage({content: "You are still on video " + params, centered: true});
            return ({content: "You are still on video " + params});
        } else {
            i = newVideo - 1;
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
            if (i > 0) {
                if (i < videos.length - 1) {
                    updateMessage({
                        id: id,
                        content: "Show videos",
                        commandLeft: "previous",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "video " + (i + 1) + " of " + videos.length,
                        time: 0
                    });
                } else {
                    updateMessage({
                        id: id,
                        content: "Show videos",
                        commandLeft: "previous",
                        cancelable: true,
                        infoCenter: "video " + (i + 1) + " of " + videos.length,
                        time: 0
                    });
                }
            } else {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video 1 of " + videos.length,
                    time: 0
                });
            }
            return({content: "You watch video " + (i + 1)});
        }
    })
);

/**
 * play video
 */
addContentScriptMethod(
    new ContentScriptMethod("playVideo", function () {
        videos[i].play();
        updateMessage({
            id: id,
            content: "Show videos",
            cancelable: true,
            infoCenter: "Volume: " + videos[i].volume,
            time: 0
        });
    })
);

/**
 * stop video
 */
addContentScriptMethod(
    new ContentScriptMethod("stopVideo", function () {
        videos[i].pause();
        if (i > 0) {
            if (i < videos.length - 1) {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            }
        } else {
            updateMessage({
                id: id,
                content: "Show videos",
                commandRight: "next",
                cancelable: true,
                infoCenter: "video 1 of " + videos.length,
                time: 0
            });
        }
    })
);

/**
 * click video
 */
addContentScriptMethod(
    new ContentScriptMethod("clickVideo", function () {
        videos[i].click();
    })
);

/**
 * mute video
 */
addContentScriptMethod(
    new ContentScriptMethod("muteVideo", function () {
        $(videos[i]).prop('muted', true);
        if (videos[i].play) {
            updateMessage({
                id: id,
                content: "Show videos",
                cancelable: true,
                infoCenter: "muted",
                time: 0
            });
        }
    })
);

/**
 * unmute video
 */
addContentScriptMethod(
    new ContentScriptMethod("unmuteVideo", function () {
        $(videos[i]).prop("muted", false);
        if (videos[i].play) {
            updateMessage({
                id: id,
                content: "Show videos",
                cancelable: true,
                infoCenter: "Volume: " + videos[i].volume,
                time: 0
            });
        }
    })
);

/**
 * jump forward in video
 */
addContentScriptMethod(
    new ContentScriptMethod("jumpForwardVideo", function () {
        videos[i].currentTime += 10;
    })
);

/**
 * jump backwards in video
 */
addContentScriptMethod(
    new ContentScriptMethod("jumpBackwardsVideo", function () {
        videos[i].currentTime -= 10;
    })
);

/**
 * jump to certain time
 */
addContentScriptMethod(
    new ContentScriptMethod("jumpCertainVideo", function (params) {
        var time = [];
        if (params.toString().indexOf(":") > 0) {
            time = params.toString().split(":");
        } else {
            time = params.toString().split(" ");
        }
        if (time[0] > 0) {
            var minutes = parseInt(time[0] * 60);
            var seconds = parseInt(time[1]);
            videos[i].currentTime = minutes + seconds;
        } else {
            videos[i].currentTime = time[1];
        }

    })
);

/**
 * increase volume
 */
addContentScriptMethod(
    new ContentScriptMethod("increaseVolume", function () {
        if (videos[i].muted) {
            $(videos[i]).prop("muted", false);
        }
        if (videos[i].volume + 0.1 <= 1) {
            videos[i].volume += 0.1;
        } else {
            videos[i].volume = 1;
        }
        if (videos[i].play) {
            updateMessage({
                id: id,
                content: "Show videos",
                cancelable: true,
                infoCenter: "Volume: " + videos[i].volume,
                time: 0
            });
        }
    })
);

/**
 * decrease volume
 */
addContentScriptMethod(
    new ContentScriptMethod("decreaseVolume", function () {
        if (videos[i].muted) {
            $(videos[i]).prop("muted", false);
        }
        if (videos[i].volume - 0.1 >= 0) {
            videos[i].volume -= 0.1;
        } else {
            videos[i].volume = 0;
        }
        if (videos[i].play) {
            updateMessage({
                id: id,
                content: "Show videos",
                cancelable: true,
                infoCenter: "Volume: " + videos[i].volume,
                time: 0
            });
        }
    })
);

/**
 * set volume
 */
addContentScriptMethod(
    new ContentScriptMethod("setVolumeVideo", function (params) {
        if (videos[i].muted) {
            $(videos[i]).prop("muted", false);
        }
        if (params > 0) {
            if (params > 100) {
                videos[i].volume = 1;
            } else {
                videos[i].volume = parseInt(params) / 100;
            }
        } else {
            videos[i].volume = 0;
        }
        if (videos[i].play) {
            updateMessage({
                id: id,
                content: "Show videos",
                cancelable: true,
                infoCenter: "Volume: " + videos[i].volume,
                time: 0
            });
        }
    })
);

/**
 * cancel video state
*/
addContentScriptMethod(
    new ContentScriptMethod("cancelVideoState", function () {
        hideMessage({id: id});
        id = "";
    })
);