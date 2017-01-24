/**
 * Created by Philip on 24.01.2017.
 */
addModule(new Module("scrollModule", function() {

    /**
     * scroll to top of the page
     */
    var scrollToTop = new Action("scroll to top", 0, globalCommonState);
    scrollToTop.addCommand(new Command("(?:scroll )?(?:to )?(?:the )?\\btop\\b", 0));
    scrollToTop.act = function() {
        callContentScriptMethod("scrollToTop", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollToTop);

    /**
     * scroll to the middle of the page
     */
    var scrollToMiddle = new Action("scroll to middle", 0, globalCommonState);
    scrollToMiddle.addCommand(new Command("(?:scroll )?(?:to )?(?:the )?\\bmiddle\\b", 0));
    scrollToMiddle.act = function() {
        callContentScriptMethod("scrollToMiddle", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollToMiddle);

    /**
     * scroll to the bottom of the page
     */
    var scrollToBottom = new Action("scroll to bottom", 0, globalCommonState);
    scrollToBottom.addCommand(new Command("(?:scroll )?(?:to )?(?:the )?\\bbottom\\b", 0));
    scrollToBottom.act = function() {
        callContentScriptMethod("scrollToBottom", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollToBottom);

    /**
     * scroll up
     */
    var scrollUp = new Action("scroll up", 0, globalCommonState);
    scrollUp.addCommand(new Command("(?:scroll )?\\bup\\b", 0));
    scrollUp.act = function() {
        callContentScriptMethod("scrollUp", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollUp);

    /**
     * scroll down
     */
    var scrollDown = new Action("scroll down", 0, globalCommonState);
    scrollDown.addCommand(new Command("(?:scroll )?\\bdown\\b", 0));
    scrollDown.act = function() {
        callContentScriptMethod("scrollDown", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollDown);

    /**
     * scroll left
     */
    var scrollLeft = new Action("scroll left", 0, globalCommonState);
    scrollLeft.addCommand(new Command("(?:scroll )?\\bleft\\b", 0));
    scrollLeft.act = function() {
        callContentScriptMethod("scrollLeft", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollLeft);

    /**
     * scroll right
     */
    var scrollRight = new Action("scroll right", 0, globalCommonState);
    scrollRight.addCommand(new Command("(?:scroll )?\\bright\\b", 0));
    scrollRight.act = function() {
        callContentScriptMethod("scrollRight", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollRight);

}));