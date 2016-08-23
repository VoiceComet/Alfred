/**
 * csm for interacting with objects
 */
//current number of image
var i = 0;
var images = [];
//control how much images were shown in one next step
var nexts = 0;
//control if a previous action was done before
var prevs = false;

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
        //layout
        $("body").append("<div id='objectUIDIVBackground'></div>");
        $("body").append("<div id='objectUIDIV'></div>");
        var divs = $("img:only-of-type").parent().clone();
        images = jQuery.makeArray(divs);
        images.pop();
        //show first 15 images
        for (i = 0; i < 15; i++) {
            $("#objectUIDIV").append(images[i]);
        }
    })
);

/**
 * show next objects
 */
addContentScriptMethod(
    new ContentScriptMethod("nextObjects", function () {
        nexts = 0;
        for (var j = 0; j < 15; j++) {
            if (i >= images.length) {
                showMessage({content: "no further images on this page"});
                return;
            //if last step was a previous step one has to increase i by 15
            } else if (j === 0 && prevs) {
                nexts++;
                i += 15;
                prevs = false;
                showMessage({content: "show next hits"});
                $("#objectUIDIV").empty();
                $("#objectUIDIV").append(images[i]);
                i++;
            } else if (j === 0){
                nexts++;
                showMessage({content: "show next hits"});
                $("#objectUIDIV").empty();
                $("#objectUIDIV").append(images[i]);
                i++;
            } else {
                nexts++;
                $("#objectUIDIV").append(images[i]);
                i++;
            }
        }
    })
);

/**
 * show previous hits
 */
addContentScriptMethod(
    new ContentScriptMethod("previousObjects", function () {
        for (var j = 0; j < 15; j++) {
            //in between the first 15 images
            if (j === 0 && i < 15) {
                showMessage({content: "no previous images"});
                return;
            } else if (j === 0){
                i -= nexts + 1;
                nexts = 0;
                prevs = true;
                showMessage({content: "show previous hits"});
                $("#objectUIDIV").empty();
                $("#objectUIDIV").prepend(images[i]);
            } else {
                i--;
                $("#objectUIDIV").prepend(images[i]);
            }
        }
    })
);

/**
 * cancel object state
*/
addContentScriptMethod(
    new ContentScriptMethod("cancelObjectState", function () {
        $("#objectUIDIV").remove();
        $("#objectUIDIVBackground").remove();
    })
);