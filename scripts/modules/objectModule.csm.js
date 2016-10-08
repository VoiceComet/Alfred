/**
 * csm for interacting with objects
 */
//current number of image
var i = 0;
//var objects = [];
var images = [];
//control how much images were shown in one next step
var nextSteps = 0;
//control if a previous action was done before
var prevSteps = false;
var id = "";
var pages = 1;

/**
 * show all videos
 */
addContentScriptMethod(
    new ContentScriptMethod("showVideos", function () {
        showMessage({content: "Show all videos"});
        $("body").append("<div id='objectUIDIV'></div>");

        var html5 = document.getElementsByTagName("video");
        alert(html5.length);
        var youtube = document.getElementsByTagName("iframe");
        alert(youtube.length);
        var linkWithVideo = jQuery.makeArray($("a:has(video-id)"));
        alert(linkWithVideo.length);
        for (var htmlV = 0; htmlV < html5.length; htmlV++) {
            $("#objectUIDIV").append("<div id='" + htmlV +"'></div>");
            $("#" + htmlV).append(html5[htmlV]);
        }
        for (var iframeV = 0; iframeV < youtube.length; iframeV++) {
            $("#objectUIDIV").append("<div id='" + iframeV +"'></div>");
            $("#" + iframeV).append(youtube[iframeV]);
        }
        for (var linkV = 0; linkV < linkWithVideo.length; linkV++) {
            $("#objectUIDIV").append("<div id='" + linkV +"'></div>");
            $("#" + linkV).append(linkWithVideo[linkV]);
        }

    })
);

/**
 * show all images
 */
addContentScriptMethod(
    new ContentScriptMethod("showImages", function () {
        $("#objectUIDIV").remove();
        $("#objectUIDIVBackground").remove();
        if (images.length > 0) {
            images = [];
        }
        var container = jQuery.makeArray($("img"));
        for (var j = 0; j < container.length; j++) {
            if (container[j].height > 75 && container[j].width > 75) {
                images.push(container[j].getAttribute("src"));
            }
        }
        images.pop();
        if (images.length > 0) {
            if (Math.ceil(images.length / 9) > 1) {
                if (id != "") {
                    pages = 1;
                    updateMessage({
                        id: id,
                        content: "Show images",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                } else {
                    id = showMessage({
                        content: "Show images",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                }
            } else {
                if (id != "") {
                    pages = 1;
                    updateMessage({
                        id: id,
                        content: "Show images",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                } else {
                    id = showMessage({
                        content: "Show images",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                }
            }
            $("body")
                .append("<div id='objectUIDIVBackground'></div>")
                .append("<div id='objectUIDIV'></div>");
            //show first 9 images
            $("#objectUIDIV").load(chrome.extension.getURL("objectUI.html"), function () {
                for (i = 0; i < 9; i++) {
                    if (i < images.length) {
                        $("#objectCell" + i).append("<img src='" + images[i] + "'>");
                    } else {
                        return;
                    }
                }
            });
            return({content: "I found " + images.length + " images. You are on page one"});

        } else {
            showMessage({content: "No images found on this page"});
            return({content: "I found no relevant images on this page"});
        }
    })
);

/**
 * show next objects
 */
addContentScriptMethod(
    new ContentScriptMethod("nextObjects", function () {
        if (i >= images.length) {
            showMessage({content: "No further images on this page"});
            return({content: "There are no further images on this page"});
        } else {
            if (prevSteps) {
                i += 9;
            }
            nextSteps = 0;
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutLeft 700ms steps(20);");
            setTimeout(function () {
                $("body")
                    .append("<div id='objectUIDIV'></div>");
                $("#objectUIDIV")
                    .attr("style", "-webkit-animation: fadeInRight 700ms steps(40);")
                    .load(chrome.extension.getURL("objectUI.html"), function () {
                        for (var j = 0; j < 9; j++) {
                            var k = j + 1;
                            if (i < images.length) {
                                $("#objectCell" + j).append("<p>" + k + "</p><img src='" + images[i] + "'>");
                                nextSteps++;
                                i++;
                            }
                        }
                    });
            }, 650);

            prevSteps = false;
            pages++;
            if (pages < Math.ceil(images.length / 9)) {
                updateMessage({
                    id: id,
                    content: "Show images",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Show images",
                    commandLeft: "previous",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            }
            return({content: "You are now on page " + pages + "of" + Math.ceil(images.length / 9)});
        }
    })
);

/**
 * show previous hits
 */
addContentScriptMethod(
    new ContentScriptMethod("previousObjects", function () {
        if (i < 9 || images.length < 9) {
            showMessage({content: "No previous images"});
            return({content: "There are no previous images on this page"});
        } else {
            i -= nextSteps - 1;
            $("#objectUIDIV")
                .empty()
                .load(chrome.extension.getURL("objectUI.html"), function () {
                for (var j = 9; j > - 1; j--) {
                    i--;
                    var k = j + 1;
                    $("#objectCell" + j).append("<p>" + k + "</p><img src='" +images[i] + "'>");
                }
            });
            nextSteps = 0;
            prevSteps = true;
            pages--;
            if (pages > 1) {
                updateMessage({
                    id: id,
                    content: "Show images",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Show images",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            }
            return({content: "You are now on page " + pages + "of" + Math.ceil(images.length / 9)});
        }
    })
);

/**
 * cancel object state
*/
addContentScriptMethod(
    new ContentScriptMethod("cancelObjectState", function () {
        $("#objectUIDIV").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        $("#objectUIDIVBackground").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        setTimeout(function () {
            $("#objectUIDIV").remove();
            $("#objectUIDIVBackground").remove();
        }, 460);
        hideMessage({id: id});
    })
);