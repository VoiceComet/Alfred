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

/**
 * show all videos
 */
addContentScriptMethod(
    new ContentScriptMethod("showVideos", function () {
        showMessage({content: "show all videos"});
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
        var Test = $("img:only-of-type");
        for (var j = 0; j < Test.length; j++) {
            if (Test[j].height > 75 && Test[j].width > 75) {
                images.push(Test[j]);
            }
        }
        images.pop();
        if (images.length > 0) {
            showMessage({content: "show all images"});
            $("body").append("<div id='objectUIDIV'></div>");
            //var container = images.parent().clone();
            //objects = jQuery.makeArray(container);
            //objects.pop();
            //show first 9 images
            $("#objectUIDIV").load(chrome.extension.getURL("objectUI.html"), function () {
                for (i = 0; i < 9; i++) {
                    $("#objectCell" + i).append(images[i]);
                }
            });

        } else {
            showMessage({content: "no images found on this page"});
        }
    })
);

/**
 * show next objects
 */
addContentScriptMethod(
    new ContentScriptMethod("nextObjects", function () {
        if (i >= images.length) {
            showMessage({content: "no further images on this page"});
        } else {
            if (prevSteps) {
                i += 9;
            }
            nextSteps = 0;
            showMessage({content: "show next images"});
            $("#objectUIDIV")
                .empty()
                .load(chrome.extension.getURL("objectUI.html"), function () {
                for (var j = 0; j < 9; j++) {
                    $("#objectCell" + j).append(images[i]);
                    nextSteps++;
                    i++;
                }
            prevSteps = false;
            });
        }
    })
);

/**
 * show previous hits
 */
addContentScriptMethod(
    new ContentScriptMethod("previousObjects", function () {
        if (i < 9 || images.length < 9) {
            showMessage({content: "no previous images"});
        } else {
            i -= nextSteps - 1;
            showMessage({content: "show previous images"});
            $("#objectUIDIV")
                .empty()
                .load(chrome.extension.getURL("objectUI.html"), function () {
                for (var j = 9; j > - 1; j--) {
                    i--;
                    $("#objectCell" + j).append(images[i]);
                }
            nextSteps = 0;
            prevSteps = true;
            });
        }
    })
);

/**
 * cancel object state
*/
addContentScriptMethod(
    new ContentScriptMethod("cancelObjectState", function () {
        $("#objectUIDIV").remove();
    })
);