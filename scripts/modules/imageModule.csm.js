/**
 * csm to interact with images
 */

var i = 0;
var images = [];
var objects = [];
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
            var imageWidth = container[j].width;
            var imageHeight = container[j].height;
            if (imageWidth > 75 && imageHeight > 75) {
                images.push(container[j].getAttribute("src"));
                objects.push(container[j]);
            }
        }
        if (images.length > 0) {
            if (Math.ceil(images.length / 9) > 1) {
                if (id != "") {
                    pages = 1;
                    updateMessage({
                        id: id,
                        content: "Gallery mode",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                } else {
                    id = showMessage({
                        content: "Gallery mode",
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
                        content: "Gallery mode",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                } else {
                    id = showMessage({
                        content: "Gallery mode",
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
            showMessage({content: "No images found on this page" , centered: true});
            return({content: "I found no relevant images on this page", followingState: "globalCommonState"});
        }
    })
);

/**
 * show next page
 */
addContentScriptMethod(
    new ContentScriptMethod("nextGalleryPage", function () {
        if (pages >= Math.ceil(images.length / 9)) {
            showMessage({content: "No further images on this website", centered: true});
            return({content: "There are no further images on this website"});
        } else {
            pages++;
            i = pages * 9 - 1;
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutLeft 700ms steps(20);");
            setTimeout(function () {
                for (var j = 8; j > - 1; j--) {
                    if (i < images.length) {
                        $("#imagesCell" + j)
                            .empty()
                            .append("<img src='" + images[i] + "'>");
                        i--;
                    } else {
                        $("#imagesCell" + j).empty();
                        i--;
                    }
                }
                $("#objectUIDIV").attr("style", "-webkit-animation: fadeInRight 700ms steps(40);");
            }, 650);
            if (pages < Math.ceil(images.length / 9)) {
                updateMessage({
                    id: id,
                    content: "Gallery mode",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Gallery mode",
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
 * show previous page
 */
addContentScriptMethod(
    new ContentScriptMethod("previousGalleryPage", function () {
        if (pages < 2 || images.length < 9) {
            showMessage({content: "No previous images", centered: true});
            return({content: "There are no previous images on this page"});
        } else {
            pages--;
            i = pages * 9 - 1;
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutRight 700ms steps(20);");
            setTimeout(function () {
                for (var j = 8; j > - 1; j--) {
                    $("#imagesCell" + j)
                        .empty()
                        .append("<img src='" + images[i] + "'>");
                    i--;
                }
                $("#objectUIDIV").attr("style", "-webkit-animation: fadeInLeft 700ms steps(40);");
            }, 650);
            if (pages > 1) {
                updateMessage({
                    id: id,
                    content: "Gallery mode",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Gallery mode",
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
 * go to certain gallery page
 */
addContentScriptMethod(
    new ContentScriptMethod("certainGalleryPage", function (params) {
        if (params === "one") {
            params = 1;
        }
        if (Math.ceil(images.length / 9) < parseInt(params) || 0 >= parseInt(params) || isNaN(parseInt(params))) {
            showMessage({content: "There is no page " + params, centered: true});
            return ({content: "There is no page " + params});
        } else if (pages === parseInt(params)) {
            showMessage({content: "You are still on page " + params, centered: true});
            return ({content: "You are still on page " + params});
        } else {
            // go to a previous page
            if (pages > params) {
                i = params * 9 - 1;
                $("#objectUIDIV").attr("style", "-webkit-animation: fadeOutRight 700ms steps(20);");
                setTimeout(function () {
                    for (var j = 8; j > - 1; j--) {
                        $("#imagesCell" + j)
                            .empty()
                            .append("<img src='" + images[i] + "'>");
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
                        if (i < images.length) {
                            $("#imagesCell" + j)
                                .empty()
                                .append("<img src='" + images[i] + "'>");
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
                        content: "Gallery mode",
                        commandLeft: "previous",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                } else {
                    updateMessage({
                        id: id,
                        content: "Gallery mode",
                        commandLeft: "previous",
                        cancelable: true,
                        infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                        time: 0
                    });
                }
            } else {
                updateMessage({
                    id: id,
                    content: "Gallery mode",
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
 * start slide mode
 */
addContentScriptMethod(
    new ContentScriptMethod("showOneImage", function (params) {
        if ((pages * 9 - 9 + parseInt(params) > images.length) || (parseInt(params) > 9) || (parseInt(params) < 0) || isNaN(parseInt(params))) {
            showMessage({content: "There is no image " + params + " on this page", centered: true});
            return({content: "There is no image " + params + " on this page", followingState: "galleryState"});
        } else {
            i = pages * 9 - 10 + parseInt(params);
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
            setTimeout(function () {
                $("#objectUIDIV").hide();
                $("body").append("<div id='slideDIV'><img src='" + images[i] + "'></div>");
                $("#slideDIV").attr("style", "-webkit-animation: fadeIn 500ms steps(20);");
            }, 460);
            if (i + 1 > 1) {
                if (i + 1 < images.length) {
                    updateMessage({
                        id: id,
                        content: "Slide mode",
                        commandLeft: "previous",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "image " + (i + 1) + " of " + images.length,
                        time: 0
                    });
                } else {
                    updateMessage({
                        id: id,
                        content: "Slide mode",
                        commandLeft: "previous",
                        cancelable: true,
                        infoCenter: "image " + (i + 1) + " of " + images.length,
                        time: 0
                    });
                }
            } else {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "image 1 of " + images.length,
                    time: 0
                });
            }
            return({content: "You see image, " + (i + 1) + " of " + images.length});
        }
    })
);

/**
 * show next image
 */
addContentScriptMethod(
    new ContentScriptMethod("nextImage", function () {
        if (i + 1 < images.length) {
            i++;
            $("#slideDIV").attr("style", "-webkit-animation: fadeOutLeft 500ms steps(20);");
            setTimeout(function () {
                $("#slideDIV")
                    .empty()
                    .append("<img src='" + images[i] + "'>")
                    .attr("style", "-webkit-animation: fadeInRight 500ms steps(20);");
            }, 460);
            if (i + 1 < images.length) {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "image " + (i + 1) + " of " + images.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandLeft: "previous",
                    cancelable: true,
                    infoCenter: "image " + (i + 1) + " of " + images.length,
                    time: 0
                });
            }
            return({content: "You see image, " + (i + 1) + " of " + images.length});
        } else {
            showMessage({content: "This is the last image", centered: true});
            return({content: "This is the last image"});
        }
    })
);

/**
 * show previous image
 */
addContentScriptMethod(
    new ContentScriptMethod("previousImage", function () {
        if (i - 1 >= 0) {
            i--;
            $("#slideDIV").attr("style", "-webkit-animation: fadeOutRight 500ms steps(20);");
            setTimeout(function () {
                $("#slideDIV")
                    .empty()
                    .append("<img src='" + images[i] + "'>")
                    .attr("style", "-webkit-animation: fadeInLeft 500ms steps(20);");
            }, 460);
            if (i - 1 > 0) {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "image " + (i + 1) + " of " + images.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "image " + (i + 1) + " of " + images.length,
                    time: 0
                });
            }
            return({content: "You see image, " + (i + 1) + " of " + images.length});
        } else {
            showMessage({content: "This is the first image", centered: true});
            return({content: "This is the firs image"});
        }
    })
);

/**
 * go to certain image
 */
addContentScriptMethod(
    new ContentScriptMethod("certainImage", function (params) {
        if ((parseInt(params) > images.length) || (parseInt(params) < 0) || isNaN(parseInt(params))) {
            showMessage({content: "There is no image " + params, centered: true});
            return({content: "There is no image " + params});
        } else if (i === parseInt(params)) {
            showMessage({content: "You are still on image " + params, centered: true});
            return ({content: "You are still on image " + params});
        } else {
            var oldI = i;
            i = parseInt(params) - 1;
            if (oldI > params) {
                $("#slideDIV").attr("style", "-webkit-animation: fadeOutRight 500ms steps(20);");
                setTimeout(function () {
                    $("#slideDIV")
                        .empty()
                        .append("<img src='" + images[i] + "'>")
                        .attr("style", "-webkit-animation: fadeInLeft 500ms steps(20);");
                }, 460);
                // go to a further page
            } else {
                $("#slideDIV").attr("style", "-webkit-animation: fadeOutLeft 500ms steps(20);");
                setTimeout(function () {
                    $("#slideDIV")
                        .empty()
                        .append("<img src='" + images[i] + "'>")
                        .attr("style", "-webkit-animation: fadeInRight 500ms steps(20);");
                }, 460);
            }
            if (i + 1 > 1) {
                if (i + 1 < images.length) {
                    updateMessage({
                        id: id,
                        content: "Slide mode",
                        commandLeft: "previous",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "image " + (i + 1) + " of " + images.length,
                        time: 0
                    });
                } else {
                    updateMessage({
                        id: id,
                        content: "Slide mode",
                        commandLeft: "previous",
                        cancelable: true,
                        infoCenter: "image " + (i + 1) + " of " + images.length,
                        time: 0
                    });
                }
            } else {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "image 1 of " + images.length,
                    time: 0
                });
            }
            return({content: "You see image, " + (i + 1) + " of " + images.length});
        }
    })
);


/**
 * click image
 */
addContentScriptMethod(
    new ContentScriptMethod("clickImage", function () {
        var link = $(objects[i]).parent('a');
        if (link.length > 0) {
            $("#slideDIV").remove();
            $("#objectUIDIV").remove();
            $("#objectUIDIVBackground").remove();
            hideMessage({id: id});
            id = "";
            return({link: link[0].href});
        } else {
           showMessage({content: "This image has no link", centered: true});
           return({content: "This image has no link", followingState: "slideState"});
        }
    })
);

/**
 * go to image on page
 */
addContentScriptMethod(
    new ContentScriptMethod("imageOnPage", function () {
        $("#slideDIV").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        $("#objectUIDIVBackground").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        setTimeout(function () {
            $("#slideDIV").hide();
            $("#objectUIDIVBackground").hide();
        }, 460);
        $('html, body')
            .animate({scrollTop: $(objects[i]).offset().top - window.innerHeight / 2}, 1000)
            .animate({scrollLeft: $(objects[i]).offset().left - window.innerWidth / 2}, 1000);
        updateMessage({
            id: id,
            content: "Slide mode",
            cancelable: true,
            infoCenter: "image " + (i + 1) + " of " + images.length,
            time: 0
        });
    })
);

/**
 * go back to slides
 */
addContentScriptMethod(
    new ContentScriptMethod("backToSlides", function () {
        $("#objectUIDIVBackground").attr("style", "-webkit-animation: fadeIn 500ms steps(20);");
        $("#slideDIV").attr("style", "-webkit-animation: fadeIn 500ms steps(20);");
        if (i + 1 > 1) {
            if (i + 1 < images.length) {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "image " + (i + 1) + " of " + images.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Slide mode",
                    commandLeft: "previous",
                    cancelable: true,
                    infoCenter: "image " + (i + 1) + " of " + images.length,
                    time: 0
                });
            }
        } else {
            updateMessage({
                id: id,
                content: "Slide mode",
                commandRight: "next",
                cancelable: true,
                infoCenter: "image 1 of " + images.length,
                time: 0
            });
        }
        return({content: "Welcome back to the slides gallery"})
    })
);

/**
 * switch to gallery
 */
addContentScriptMethod(
    new ContentScriptMethod("switchToGallery", function () {
        pages = Math.ceil(i / 9);
        i = pages * 9 - 1;
        $("#slideDIV").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        setTimeout(function () {
            for (var j = 8; j > - 1; j--) {
                if (i < images.length) {
                    $("#imagesCell" + j)
                        .empty()
                        .append("<img src='" + images[i] + "'>");
                    i--;
                } else {
                    $("#imagesCell" + j).empty();
                    i--;
                }
            }
            $("#slideDIV").remove();
            $("#objectUIDIV").attr("style", "-webkit-animation: fadeIn 700ms steps(40);");
        }, 470);
        if (pages > 1) {
            if (pages < Math.ceil(images.length / 9)) {
                updateMessage({
                    id: id,
                    content: "Gallery mode",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Gallery mode",
                    commandLeft: "previous",
                    cancelable: true,
                    infoCenter: "page " + pages + " of " + Math.ceil(images.length / 9),
                    time: 0
                });
            }
        } else {
            updateMessage({
                id: id,
                content: "Gallery mode",
                commandRight: "next",
                cancelable: true,
                infoCenter: "page 1 of " + Math.ceil(images.length / 9),
                time: 0
            });
        }
        return({content: "You are now on page " + pages + "of" + Math.ceil(images.length / 9)});
    })
);

/**
 * cancel galleryState
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelGalleryState", function () {
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

/**
 * cancel slideState
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelSlideState", function () {
        $("#slideDIV").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        $("#objectUIDIVBackground").attr("style", "-webkit-animation: fadeOut 500ms steps(20);");
        setTimeout(function () {
            $("#slideDIV").remove();
            $("#objectUIDIV").remove();
            $("#objectUIDIVBackground").remove();
        }, 460);
        hideMessage({id: id});
        id = "";
    })
);

