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
        if (videos.length > 0) {
            $(videos[i]).css("display", "block");
            $(videos[i]).css("visibility", "visible");
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
            id = showMessage({
                content: translate("showVideos"),
                commandRight: translate("next"),
                cancelable: true,
                infoCenter: translate("videoXOfY").format([i + 1, videos.length]),
                time: 0
            });
            if (videos.length > 1) {
                return({content: translate("foundXVideosYouWatchFirstVideo").format([videos.length])});
            } else {
                return({content: translate("foundOneVideo")});
            }
        } else {
            showMessage({content: translate("notifyFoundNoVideos"), centered: true});
            return({content: translate("sayFoundNoVideos"), followingState: "globalCommonState"});
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
            $(videos[i]).css("display", "block");
            $(videos[i]).css("visibility", "visible");
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
            var message = {
				id: id,
				content: translate("showVideos"),
				commandLeft: translate("previous"),
				cancelable: true,
				infoCenter: translate("videoXOfY").format([i + 1, videos.length]),
				time: 0
			};
            if (i + 1 < videos.length) {
				message.commandRight = translate("next");
            }
			updateMessage(message);
            return({content: translate("youWatchVideoX").format([i + 1])});
        } else {
            showMessage({content: translate("thisIsTheLastVideo"), centered: true});
            return({content: translate("thisIsTheLastVideo")});
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
            $(videos[i]).css("display", "block");
            $(videos[i]).css("visibility", "visible");
            console.debug($(videos[i]).offset().top, $(videos[i]).offset().left);
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
			var message = {
				id: id,
				content: translate("showVideos"),
				commandRight: translate("next"),
				cancelable: true,
				infoCenter: translate("videoXOfY").format([i + 1, videos.length]),
				time: 0
			};
            if (i - 1 > -1) {
				message.commandLeft = translate("previous");
            }
			updateMessage(message);
			return({content: translate("youWatchVideoX").format([i + 1])});
        } else {
			showMessage({content: translate("thisIsTheFirstVideo"), centered: true});
			return({content: translate("thisIsTheFirstVideo")});
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
                showMessage({content: translate("thereIsNoVideoX").format([params]), centered: true});
                return({content: translate("thereIsNoVideoX").format([params])});
        } else if (i === newVideo - 1) {
            showMessage({content: translate("youAreStillOnVideoX").format([params]), centered: true});
            return ({content: translate("youAreStillOnVideoX").format([params])});
        } else {
            i = newVideo - 1;
            $(videos[i]).css("display", "block");
            $(videos[i]).css("visibility", "visible");
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 4}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 4}, 1000);
			var message = {
				id: id,
				content: translate("showVideos"),
				cancelable: true,
				infoCenter: translate("videoXOfY").format([i + 1, videos.length]),
				time: 0
			};
            if (i > 0) {
                if (i < videos.length - 1) {
					message.commandLeft = translate("previous");
					message.commandRight = translate("next");
                } else {
					message.commandLeft = translate("previous");
                }
            } else {
				message.commandRight = translate("next");
            }
			updateMessage(message);
			return({content: translate("youWatchVideoX").format([i + 1])});
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
            content: translate("showVideos"),
            cancelable: true,
            infoCenter: translate("volumeX").format([(Math.round(videos[i].volume * 100)/100).toFixed(2)]),
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
		var message = {
			id: id,
			content: translate("showVideos"),
			cancelable: true,
			infoCenter: translate("videoXOfY").format([i + 1, videos.length]),
			time: 0
		};
		if (i > 0) {
			if (i < videos.length - 1) {
				message.commandLeft = translate("previous");
				message.commandRight = translate("next");
			} else {
				message.commandLeft = translate("previous");
			}
		} else {
			message.commandRight = translate("next");
		}
		updateMessage(message);
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
                content: translate("showVideos"),
                cancelable: true,
                infoCenter: translate("muted"),
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
				content: translate("showVideos"),
				cancelable: true,
				infoCenter: translate("volumeX").format([(Math.round(videos[i].volume * 100)/100).toFixed(2)]),
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
				content: translate("showVideos"),
				cancelable: true,
				infoCenter: translate("volumeX").format([(Math.round(videos[i].volume * 100)/100).toFixed(2)]),
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
				content: translate("showVideos"),
				cancelable: true,
				infoCenter: translate("volumeX").format([(Math.round(videos[i].volume * 100)/100).toFixed(2)]),
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
				content: translate("showVideos"),
				cancelable: true,
				infoCenter: translate("volumeX").format([(Math.round(videos[i].volume * 100)/100).toFixed(2)]),
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