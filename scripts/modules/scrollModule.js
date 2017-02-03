/**
 * Created by Philip on 24.01.2017.
 */
addModule(new Module("scrollModule", function() {

    /**
     * scroll to top of the page
     */
    var scrollToTop = new Action("scrollToTop", 0, globalCommonState);
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
    var scrollToMiddle = new Action("scrollToMiddle", 0, globalCommonState);
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
    var scrollToBottom = new Action("scrollToBottom", 0, globalCommonState);
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
    var scrollUp = new Action("scrollUp", 0, globalCommonState);
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
    var scrollDown = new Action("scrollDown", 0, globalCommonState);
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
    var scrollLeft = new Action("scrollLeft", 0, globalCommonState);
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
    var scrollRight = new Action("scrollRight", 0, globalCommonState);
    scrollRight.act = function() {
        callContentScriptMethod("scrollRight", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    this.addAction(scrollRight);

}));