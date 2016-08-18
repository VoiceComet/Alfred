/**
 * csm for interacting with objects
 */
//scrolling factors
var i = 0;
var images = [];

/**
 * show all videos
 */
addContentScriptMethod(
    new ContentScriptMethod("showVideos", function () {
        showMessage({content: "show all videos"});
        $("body").append("<div id='objectUIDIV'></div>");
        var videos = document.getElementsByTagName("video");
        alert(videos.length);
    })
);

/**
 * show all images
 */
addContentScriptMethod(
    new ContentScriptMethod("showImages", function () {
        showMessage({content: "show all images"});
        $("body").append("<div id='objectUIDIVBackground'></div>");
        $("body").append("<div id='objectUIDIV'></div>");
        var arr = $("img").clone();
        images = jQuery.makeArray(arr);
        images.pop();
        for (i = 0; i < 14; i++) {
            $("#objectUIDIV").append(images[i].outerHTML);
        }
    })
);

/**
 * show next objects
 */
addContentScriptMethod(
    new ContentScriptMethod("nextObjects", function () {
        showMessage({content: "show next hits"});
        $("objectUIDIV").text("");
        for (var j = 0; j < 14; j++) {
            i++;
            $("#objectUIDIV").append(images[i].outerHTML);
        }
    })
)
/**
 * cancel object state
*/
addContentScriptMethod(
    new ContentScriptMethod("cancelObjectState", function () {
        $("#objectUIDIV").remove();
        $("#objectUIDIVBackground").remove();
    })
);