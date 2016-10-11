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
    new ContentScriptMethod("showVideos", function () {
        i = 0;
        var html5 = jQuery.makeArray($("video"));
        for (var j = 0; j < html5.length; j++) {
            if (html5[j].width > 0 && html5[j].height > 0) {
                videos.push(html5[j]);
            }
        }
        var iframeVideo = jQuery.makeArray($("iframe"));
        for (var k = 0; k < iframeVideo.length; k++) {
            if (iframeVideo[k].width > 0 && iframeVideo[k].height > 0) {
                videos.push(iframeVideo[k]);
            }
        }
        /**var linkWithVideo = jQuery.makeArray($("a:has(video-id)"));
        var clipboard = html5.concat(youtube);
        var container = clipboard.concat(linkWithVideo);
        for (var j = 0; j < container.length; j++) {
            alert(container[j].width);
            if (container[j].width > 0 || container[j].height > 0) {
                    videos.push(container[j]);
            }
        }**/
        if (videos.length > 0) {
            $("body")
                .append("<div id='objectUIDIVBackground'></div>")
                .append("<div id='objectUIDIV'></div>");
            //show first 9 videos
            $("#objectUIDIV").append(videos[i]);
            id = showMessage({
                content: "Show videos",
                commandRight: "next",
                cancelable: true,
                infoCenter: "video " + (i + 1) + " of " + videos.length,
                time: 0
            })
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
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutLeft 700ms steps(20);");
            setTimeout(function () {
                $("#objectUIDIV")
                    .empty()
                    .append(videos[i])
                    .attr("style", "-webkit-animation: fadeInRight 700ms steps(40);");
            }, 650);
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
        if (i - 1 > -1) {
            i--;
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutRight 700ms steps(20);");
            setTimeout(function () {
                $("#objectUIDIV")
                    .empty()
                    .append(videos[i])
                    .attr("style", "-webkit-animation: fadeInLeft 700ms steps(40);");
            }, 650);
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
        } else {
            showMessage({content: "This is the first video", centered: true});
            return({content: "This is the first video"});
        }
    })
);

/**
 * play video
 */
addContentScriptMethod(
    new ContentScriptMethod("playVideo", function () {
        $("#objectUIDIV").trigger("click");
    })
);

/**
 * cancel video state
*/
addContentScriptMethod(
    new ContentScriptMethod("cancelVideoState", function () {
        $("#objectUIDIV").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        $("#objectUIDIVBackground").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        setTimeout(function () {
            $("#objectUIDIV").remove();
            $("#objectUIDIVBackground").remove();
        }, 460);
        hideMessage({id: id});
        id = "";
    })
);