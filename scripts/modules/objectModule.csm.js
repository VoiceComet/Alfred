/**
 * csm for interacting with objects
 */
//scrolling factors
var scrollHeightFactor = 0.7;
var scrollWidthFactor = 0.7;

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
        $("img").clone().appendTo("#objectUIDIV");
        $("#objectUIDIV").children().last().remove();
        //var images = document.getElementsByTagName("img");
        //for (var i = 1; i < images.length; i++) {
        //    $("#objectUIDIV").append(images[0]);
        //}
    })
);

/**
 * scroll down
 */
addContentScriptMethod(
    new ContentScriptMethod("scrollDownDiv", function () {
        alert($("#objectUIDIV").offsetHeight);
        alert($("#objectUIDIV").scrollHeight);
        alert($("#objectUIDIV").scrollTop);
        var scrollHeight = $("#objectUIDIV").height * scrollHeightFactor;
        var bottom = $("#objectUIDIV").scrollHeight - $("#objectUIDIV").height;
        var scrollPosVertical = $("#objectUIDIV").scrollTop;
        //scrolling position is not at the bottom of the div -> scroll down
        if(scrollPosVertical < bottom) {
            showMessage({content: "scroll down"});
            $("#objectUIDIV").animate({scrollTop: scrollPosVertical + scrollHeight}, 1000);
        //Position of scrolling is on the bottom of the div -> alert
        } else {
            showMessage({title: "Attention!", content: "Scrolling down isn't possible"});
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