/**
 * module to interact with images
 */
addModule(new Module("imageModule", function () {

    /**
     * state to interact with gallery
     */
    var galleryState = new State("galleryState");
    galleryState.init = function () {
        this.cancelAction.cancelAct = function () {
            callContentScriptMethod("cancelGalleryState", {});
            say(translate("sayStoppedInteractingImages"));
        };
    };

    /**
     * state to interact with slides
     */
    var slideState = new State("slideState");
    slideState.init = function () {
        this.cancelAction.cancelAct = function () {
            callContentScriptMethod("cancelSlideState", {});
            say(translate("sayStoppedInteractingImages"));
        };
    };

    /**
     * show all images
     */
    var showImages = new Action("showImages", 0, galleryState);
    showImages.act = function () {
        callContentScriptMethod("showImages", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "globalCommonState") {
                        changeActiveState(globalCommonState);
                    }
                }
            }
        });
    };
    this.addAction(showImages);
    galleryState.addAction(showImages);

    /**
     * show next gallery page
     */
    var nextImages = new Action("next", 0, galleryState);
    nextImages.act = function () {
        callContentScriptMethod("nextGalleryPage", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
            }
        });
    };
    galleryState.addAction(nextImages);

    /**
     * show previous gallery page
     */
    var previousImages = new Action("previous", 0, galleryState);
    previousImages.act = function () {
        callContentScriptMethod("previousGalleryPage", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
            }
        });
    };
    galleryState.addAction(previousImages);

    /**
     * go to certain page of gallery
     */
    var certainImagePage = new Action("certainGalleryPage", 1, galleryState);
    certainImagePage.act = function (arguments) {
        callContentScriptMethod("certainGalleryPage", arguments[0], function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
            }
        });
    };
    galleryState.addAction(certainImagePage);

    /**
     * start slide mode
     */
    var showOneImage = new Action("showOneImage", 1, slideState);
    showOneImage.act = function (arguments) {
        callContentScriptMethod("showOneImage", arguments[0], function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "galleryState") {
                        changeActiveState(galleryState);
                    }
                }
            }
        });
    };
    galleryState.addAction(showOneImage);

    /**
     * show next image
     */
    var nextImage = new Action("next", 0, slideState);
    nextImage.act = function () {
        callContentScriptMethod("nextImage", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
            }
        });
    };
    slideState.addAction(nextImage);

    /**
     * show previous image
     */
    var previousImage = new Action("previous", 0, slideState);
    previousImage.act = function () {
        callContentScriptMethod("previousImage", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
            }
        });
    };
    slideState.addAction(previousImage);

    /**
     * show certain image
     */
    var certainImage = new Action("certainImage", 1, slideState);
    certainImage.act = function (arguments) {
        callContentScriptMethod("certainImage", arguments[0], function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
            }
        });
    };
    slideState.addAction(certainImage);

    /**
     * click image
     */
    var clickImage = new Action("clickImage", 0, globalCommonState);
    clickImage.act = function () {
        callContentScriptMethod("clickImage", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("link")) {
                    chrome.tabs.update({url: params.link, active: true});
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "slideState") {
                        changeActiveState(slideState);
                    }
                }
            }
        });
    };
    slideState.addAction(clickImage);

    /**
     * go to image on page
     */
    var imageOnPage = new Action("imageOnPage", 0, slideState);
    imageOnPage.act = function () {
        callContentScriptMethod("imageOnPage", {})
    };
    slideState.addAction(imageOnPage);

    /**
     * go back to slides
     */
    var backToSlides = new Action("backToSlides", 0, slideState);
    backToSlides.act = function () {
      callContentScriptMethod("backToSlides", {}, function (params) {
          if (typeof params !== 'undefined') {
              if (params.hasOwnProperty("content")) {
                  say(params.content);
              }
          }
      })
    };
    slideState.addAction(backToSlides);

    /**
     * change to gallery
     */
    var switchToGallery = new Action("switchToGallery", 0, galleryState);
    switchToGallery.act = function () {
        callContentScriptMethod("switchToGallery", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
            }
        });
    };
    slideState.addAction(switchToGallery);

}));