/**
 * Module for creating and interacting with bookmarks
 */

addModule(new Module("bookmarkModule", function () {

    var folder = "";

    /**
     * state for interacting with modules
     */
    var bookmarkState = new State("bookmarkState");
    bookmarkState.init = function () {
        notify("entered bookmark state");
        this.cancelAction.act = function() {
            callContentScriptMethod("cancelObjectState", {});
            notify("canceled bookmark state");
            say("I stopped interacting with your bookmarks");
        };
    };

    /**
     * state which listens for bookmark title
     */
    var bookmarkListenState = new State("bookmarkListenState");
    bookmarkListenState.init = function () {
      notify("Say a title for the new bookmark");
      say("Which name shall i give the bookmark");
      this.cancelAction.act = function () {
          notify("canceled bookmark listen state");
          say("I canceled creating a bookmark");
      }
    };

    /**
     * state which listens for folder title
     */
    var folderListenState = new State("folderListenState");
    folderListenState.init = function () {
        notify("Say a title for the new folder");
        say("Which name shall i give the folder");
    };

    /**
     * function to check if given title or url is taken
     * @param {Object} object
     * @param {String} object.type - bookmark or folder
     * @param {String} object.title - title of object
     * @param {String} object.url - url of bookmark
     */
    var availability = function (object) {
        var available = 1;
        if (object.type = "bookmark") {
            chrome.bookmarks.search({title: object.title}, function (BookmarkTreeNodes) {
                if (BookmarkTreeNodes.length > 0) {
                    if (BookmarkTreeNodes[0].url != "") {
                        available = 0;
                        say("There is already a bookmark with the same title in your library");
                        notify("Bookmark title not available");
                    }
                } else {
                    chrome.bookmarks.search({url: object.url}, function (BookmarkTreeNodesUrl) {
                        if (BookmarkTreeNodesUrl.length > 0) {
                            available = 0;
                            say("There is already a bookmark with the same url in your library");
                            notify("Bookmark url not available");
                        }
                    });
                }
            });
        } else {
            chrome.bookmarks.search({title: object.title}, function (BookmarkTreeNodes) {
                if (BookmarkTreeNodes.length > 0) {
                    available = 0;
                    say("There is already a folder with the same title in your library");
                    notify("Folder title not available");
                }
            });
        }
        return available;
    };

    /**
     * function to interact with bookmarks/folders
     * @param {String} title - the title which should be verified
     * @param {String} object - interact with bookmark or folder
     * @param {String} action - delete or open object
     */
    var interacting = function (title, object, action) {
        chrome.bookmarks.search({title: title}, function (BookmarkTreeNodes) {
            if (BookmarkTreeNodes.length === 0) {
                say("There is no " + object + " " + title + " in your library");
                notify("No " + object + " " + title + " found");
            } else if (object === "bookmark"){
                if (action === "open") {
                    chrome.tabs.update({url: BookmarkTreeNodes[0].url, active: true});
                } else {
                    chrome.bookmarks.remove(BookmarkTreeNodes[0].id);
                    say("I removed the bookmark " + title + " from your library");
                }
            } else {
                if (action === "open") {
                    callContentScriptMethod("openFolder", {});
                } else {
                    chrome.bookmarks.removeTree(BookmarkTreeNodes[0].id);
                }
            }
        });
    };

    /**
     * add bookmark
     * @type {Action}
     */
    var addBookmark = new Action("addBookmark", 0, bookmarkListenState);
    addBookmark.addCommand(new Command("add bookmark", 0));
    addBookmark.act = function () {
        folder = "";
    };
    this.addAction(addBookmark);

    /**
     * add bookmark to folder
     * @type {Action}
     */
    var addBookmarkToFolder = new Action("addBookmarkToFolder", 1, bookmarkListenState);
    addBookmarkToFolder.addCommand(new Command("add bookmark to folder (.*)", 1));
    addBookmarkToFolder.act = function (params) {
        if (interacting(params[0], "folder", "open")) {
            folder = params[0];
        }
    };
    this.addAction(addBookmarkToFolder);

    /**
     * say title for bookmark
     * @type {Action}
     */
    var sayTitleBookmark = new Action("sayTitleBookmark", 1, globalCommonState);
    sayTitleBookmark.addCommand(new Command("(.*)" ,1));
    sayTitleBookmark.act = function (params) {
        chrome.tabs.query({currentWindow: true, active: true}, function(result) {
            var url = result[0].url;
            var goOn = availability({
                type: "bookmark",
                title: params[0],
                url: url
            });
            alert(goOn);
            if (folder != "") {
                if (goOn != 0) {
                    chrome.bookmarks.getTree(function () {
                        chrome.bookmarks.create({
                            "parentId": folder,
                            "title": params[0],
                            "url": url
                        });
                    });
                    say("I added the bookmark " + params[0] + " to the folder " + folder);
                } else {
                    say("would you like to override it?", false);
                }
            } else {
                if (goOn != 0) {
                    chrome.bookmarks.getTree(function () {
                        chrome.bookmarks.create({
                            "title": params[0],
                            "url": url
                        });
                    });
                    say("I added the bookmark " + params[0] + " to your library");
                } else {
                    say("would you like to override it?", false);
                }
            }
        });
    };
    bookmarkListenState.addAction(sayTitleBookmark);

    /**
     * open bookmark
     * @type {Action}
     */
    var openBookmark = new Action("openBookmark", 1, globalCommonState);
    openBookmark.addCommand(new Command("open bookmark (.*)", 1));
    openBookmark.act = function (params) {
        interacting(params[0], "bookmark", "open");
    };
    this.addAction(openBookmark);

    /**
     * delete bookmark
     * @type {Action}
     */
    var deleteBookmark = new Action("deleteBookmark", 1, globalCommonState);
    deleteBookmark.addCommand(new Command("delete bookmark (.*)", 1));
    deleteBookmark.act = function (params) {
        interacting(params[0], "bookmark", "delete");
    };
    this.addAction(deleteBookmark);

    /**
     * add folder
     * @type {Action}
     */
    var addFolder = new Action("addFolder", 0, folderListenState);
    addFolder.addCommand(new Command("test", 0));
    //addFolder.act = function () {};
    this.addAction(addFolder);

    /**
     * say title for folder
     * @type {Action}
     */
    var sayTitleFolder = new Action("sayTitleFolder", 1, globalCommonState);
    sayTitleFolder.addCommand(new Command("(.+)", 1));
    sayTitleFolder.act = function (params) {
        if (availability({type: "folder", title: params[0], url: ""}) != 0) {
            chrome.bookmarks.create({
                'title': params[0]
            });
            say("I added the folder " + params[0] + " to your library");
        } else {
            say("would you like to override it?", false);
        }
    };
    folderListenState.addAction(sayTitleFolder);

    /**
     * open folder
     * @type {Action}
     */
    var openFolder = new Action("openFolder", 1, globalCommonState);
    openFolder.addCommand(new Command("open folder (.*)", 1));
    openFolder.act = function (params) {
        interacting(params[0], "folder", "open");
    };
    this.addAction(openFolder);

    /**
     * delete folder
     * @type {Action}
     */
    var deleteFolder = new Action("deleteFolder", 1, globalCommonState);
    deleteFolder.addCommand(new Command("delete folder (.*)", 1));
    deleteFolder.act = function (params) {
        interacting(params[0], "folder", "delete");
    };
    this.addAction(deleteFolder);

}));
