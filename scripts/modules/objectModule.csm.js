/**
 * csm for interacting with objects
 */
//current number of image
var i = 0;
var objects = [];
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
        var images = $("img:only-of-type");
        var container = $("img:only-of-type").parent().clone();
        objects = jQuery.makeArray(container);
        objects.pop();
        //show first 15 images
        for (i = 0; i < 15; i++) {
            if(images[i].height > 50 && images[i].width > 50) {
                $("#objectUIDIV").append("<div id='" + i +"'></div>");
                $("#" + i).append(objects[i]);
            }
        }
    })
);

/**
 * show next objects
 */
addContentScriptMethod(
    new ContentScriptMethod("nextObjects", function () {
        nextSteps = 0;
        for (var j = 0; j < 15; j++) {
            if (i >= objects.length) {
                showMessage({content: "no further images on this page"});
                return;
            //if last step was a previous step one has to increase i by 15
            } else if (j === 0 && prevSteps) {
                nextSteps++;
                i += 15;
                prevSteps = false;
                showMessage({content: "show next hits"});
                $("#objectUIDIV").empty();
                $("#objectUIDIV").append(objects[i]);
                i++;
            } else if (j === 0){
                nextSteps++;
                showMessage({content: "show next hits"});
                $("#objectUIDIV").empty();
                $("#objectUIDIV").append(objects[i]);
                i++;
            } else {
                nextSteps++;
                $("#objectUIDIV").append(objects[i]);
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
                i -= nextSteps + 1;
                nextSteps = 0;
                prevSteps = true;
                showMessage({content: "show previous hits"});
                $("#objectUIDIV").empty();
                $("#objectUIDIV").prepend(objects[i]);
            } else {
                i--;
                $("#objectUIDIV").prepend(objects[i]);
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