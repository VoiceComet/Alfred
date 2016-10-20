/**
 * module to interact with images
 */
addModule(new Module("imageModule", function () {

    /**
     * state to interact with gallery
     */
    var galleryState = new State("galleryState");
    galleryState.init = function () {
        this.cancelAction.act = function () {
            callContentScriptMethod("cancelGalleryState", {});
            say("I stopped interacting with images");
        };
    };

    /**
     * state to interact with slides
     */
    var slideState = new State("slideState");
    slideState.init = function () {
        this.cancelAction.act = function () {
            callContentScriptMethod("cancelSlideState", {});
            say("I stopped interacting with images");
        };
    };

    /**
     * show all images
     */
    var showImages = new Action("showImages", 0, galleryState);
    showImages.addCommand(new Command("show images", 0));
    showImages.act = function () {
        callContentScriptMethod("showImages", {}, function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "globalCommonState") {
                        if (recognizing) activeState.stopSpeechRecognition();
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
    var nextImages = new Action("nextGalleryPage", 0, galleryState);
    nextImages.addCommand(new Command("next", 0));
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
    var previousImages = new Action("previousGalleryPage", 0, galleryState);
    previousImages.addCommand(new Command("previous", 0));
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
    certainImagePage.addCommand(new Command("go to page (.*)", 1));
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
    showOneImage.addCommand(new Command("show image ([0-9])", 1));
    showOneImage.act = function (arguments) {
        callContentScriptMethod("showOneImage", arguments[0], function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "galleryState") {
                        if (recognizing) activeState.stopSpeechRecognition();
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
    var nextImage = new Action("nextImage", 0, slideState);
    nextImage.addCommand(new Command("next", 0));
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
    var previousImage = new Action("previousImage", 0, slideState);
    previousImage.addCommand(new Command("previous", 0));
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
    certainImage.addCommand(new Command("show image ([0-9]*)", 1));
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
    clickImage.addCommand(new Command("open link", 0));
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
                        if (recognizing) activeState.stopSpeechRecognition();
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
    imageOnPage.addCommand(new Command("show image on page", 0));
    imageOnPage.act = function () {
        callContentScriptMethod("imageOnPage", {})
    };
    slideState.addAction(imageOnPage);

    /**
     * go back to slides
     */
    var backToSlides = new Action("backToSlides", 0, slideState);
    backToSlides.addCommand(new Command("back to slides gallery", 0));
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
    switchToGallery.addCommand(new Command("switch to gallery", 0));
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