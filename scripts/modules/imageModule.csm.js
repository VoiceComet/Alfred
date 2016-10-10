/**
 * csm to interact with images
 */

var i = 0;
var images = [];
var id = "";
var pages = 1;

/**
 * show all images
 */
addContentScriptMethod(
    new ContentScriptMethod("showImages", function () {
        if (images.length > 0) {
            images = [];
            pages = 1;
            $("#objectUIDIVBackground").remove();
            $("#objectUIDIV").remove();
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
            $("#objectUIDIV").load(chrome.extension.getURL("objectUIImages.html"), function () {
                for (i = 0; i < 9; i++) {
                    if (i < images.length) {
                        $("#imagesCell" + i).append("<img src='" + images[i] + "'>");
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
 * show next images
 */
addContentScriptMethod(
    new ContentScriptMethod("nextImages", function () {
        if (pages >= Math.ceil(images.length / 9)) {
            showMessage({content: "No further images on this website"});
            return({content: "There are no further images on this website"});
        } else {
            pages++;
            i = pages * 9 - 9;
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutLeft 700ms steps(20);");
            setTimeout(function () {
                var k = 0;
                for (var j = 0; j < 9; j++) {
                    k = j + 1;
                    if (i < images.length) {
                        $("#imagesCell" + j)
                            .empty()
                            .append("<p>" + k + "</p><img src='" + images[i] + "'>");
                        i++;
                    } else {
                        $("#imagesCell" + j).empty();
                        i++;
                    }
                }
                $("#objectUIDIV")
                    .attr("style", "-webkit-animation: fadeInRight 700ms steps(40);");
            }, 650);
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
    new ContentScriptMethod("previousImages", function () {
        if (pages < 2 || images.length < 9) {
            showMessage({content: "No previous images"});
            return({content: "There are no previous images on this page"});
        } else {
            pages--;
            i = pages * 9 - 1;
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutRight 700ms steps(20);");
            setTimeout(function () {
                for (var j = 8; j > - 1; j--) {
                    var k = j + 1;
                    $("#imagesCell" + j)
                        .empty()
                        .append("<p>" + k + "</p><img src='" + images[i] + "'>");
                    i--;
                }
                $("#objectUIDIV").attr("style", "-webkit-animation: fadeInLeft 700ms steps(40);");
            }, 650);
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
 * go to certain image page
 */
addContentScriptMethod(
    new ContentScriptMethod("certainImagePage", function (params) {
        if (params === "one") {
            params = 1;
        }
        if (Math.ceil(images.length / 9) < parseInt(params) || 0 >= parseInt(params) || isNaN(parseInt(params))) {
            showMessage({content: "There is no page " + params});
            return ({content: "There is no page " + params});
        } else if (pages === parseInt(params)) {
            showMessage({content: "You are still on page " + params});
            return ({content: "You are still on page " + params});
        } else {
            // go to a previous page
            if (pages > params) {
                i = params * 9 - 1;
                $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutRight 700ms steps(20);");
                setTimeout(function () {
                    for (var j = 8; j > - 1; j--) {
                        var k = j + 1;
                        $("#imagesCell" + j)
                            .empty()
                            .append("<p>" + k + "</p><img src='" + images[i] + "'>");
                        i--;
                    }
                    $("#objectUIDIV").attr("style", "-webkit-animation: fadeInLeft 700ms steps(40);");
                }, 650);
                // go to a further page
            } else {
                i = params * 9 - 9;
                $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutLeft 700ms steps(20);");
                setTimeout(function () {
                    for (var j = 0; j < 9; j++) {
                        var k = j + 1;
                        if (i < images.length) {
                            $("#imagesCell" + j)
                                .empty()
                                .append("<p>" + k + "</p><img src='" + images[i] + "'>");
                            i++;
                        } else {
                            $("#imagesCell" + j).empty();
                            i++;
                        }
                    }
                    $("#objectUIDIV")
                        .attr("style", "-webkit-animation: fadeInRight 700ms steps(40);");
                }, 650);
            }
            pages = parseInt(params);
            if (pages > 1) {
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
            } else {
                updateMessage({
                    id: id,
                    content: "Show images",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page 1 of " + Math.ceil(images.length / 9),
                    time: 0
                });
            }
            return({content: "You are now on page " + pages + "of" + Math.ceil(images.length / 9)});
        }
    })
);

/**
 * cancel image state
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelImageState", function () {
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
