/**
 * Module for creating and interacting with bookmarks
 */

addModule(new Module("bookmarkModule", function () {

    var folder = "";
    var available = 1;
    var interact = 1;

    /**
     * state for interacting with folder content
     */
    var folderState = new PanelState("folderState");
    folderState.init = function () {
        notify("Entered folder state");
        this.cancelAction.act = function() {
            callContentScriptMethod("hidePanel", {});
            notify("canceled folder state");
            say("I stopped rummaging in your library");
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
          notify("Stopped creating a bookmark");
          say("I canceled creating a bookmark");
      }
    };

    /**
     * state which listens for folder title
     */
    var folderListenState = new State("folderListenState");
    folderListenState.init = function () {
        notify("Stopped creating a folder");
        say("Which name shall i give the folder");
        this.cancelAction.act = function () {
            notify("canceled folder listen state");
            say("I canceled creating a folder");
        }
    };

    /**
     * function to check if given title or url is taken
     * @param {Object} object
     * @param {String} [object.type] - bookmark or folder
     * @param {String} object.title - title of object
     * @param {String} [object.url] - url of bookmark
     */
    var availability = function (object) {
        available = 1;
        if (object.type === "bookmark") {
            chrome.bookmarks.search({title: object.title}, function (BookmarkTreeNodesBookmark) {
                if (BookmarkTreeNodesBookmark.length > 0) {
                    for (var i = 0; i < BookmarkTreeNodesBookmark.length; i++) {
                        if (BookmarkTreeNodesBookmark[i].url != undefined) {
                            say("There is already a bookmark with the same title in your library");
                            notify("Bookmark title taken");
                            available = 0;
                        }
                    }
                } else {
                    chrome.bookmarks.search({url: object.url}, function (BookmarkTreeNodesUrl) {
                        if (BookmarkTreeNodesUrl.length > 0) {
                            say("There is already a bookmark with the same url in your library");
                            notify("Bookmark url taken");
                            available = 0;
                        }
                    });
                }
            });
        } else {
            chrome.bookmarks.search({title: object.title}, function (BookmarkTreeNodesFolder) {
                if (BookmarkTreeNodesFolder.length > 0) {
                    for (var i = 0; i < BookmarkTreeNodesFolder.length; i++) {
                        if (BookmarkTreeNodesFolder[i].url === undefined) {
                            say("There is already a folder with the same title in your library");
                            notify("Folder title taken");
                            available = 0;
                        }
                    }
                }
            });
        }
    };

    /**
     * function to interact with bookmarks/folders
     * @param {String} title - the title which should be verified
     * @param {String} object - interact with bookmark or folder
     * @param {String} action - delete or open object
     */
    var interacting = function (title, object, action) {
        interact = 1;
        chrome.bookmarks.search({title: title}, function (BookmarkTreeNodes) {
            if (BookmarkTreeNodes.length === 0) {
                interact = 0;
                say("There is no " + object + ", " + title + " in your library");
                notify("No " + object + " " + title + " found");
            } else if (object === "bookmark"){
                for (var i = 0; i < BookmarkTreeNodes.length; i++) {
                    if (BookmarkTreeNodes[i].url != undefined) {
                        if (action === "open") {
                            chrome.tabs.update({url: BookmarkTreeNodes[i].url, active: true});
                        } else {
                            chrome.bookmarks.remove(BookmarkTreeNodes[i].id);
                            say("I removed the bookmark " + title + " from your library");
                            notify("Removed bookmark " + title + " from library");
                        }
                    }
                }
            } else {
                if (action === "open") {
                    callContentScriptMethod("openFolder", {});
                } else {
                    chrome.bookmarks.removeTree(BookmarkTreeNodes[0].id);
                    say("I removed the folder " + title + " from your library");
                    notify("Removed folder " + title + " from library");
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
    addBookmarkToFolder.addCommand(new Command("create new bookmark in (.*)", 1));
    addBookmarkToFolder.act = function (params) {
        interacting(params[0], "folder", "open");
        folder = params[0];
    };
    this.addAction(addBookmarkToFolder);

    /**
     * say title for bookmark
     * @type {Action}
     */
    var sayTitleBookmark = new Action("sayTitleBookmark", 1, globalCommonState);
    sayTitleBookmark.addCommand(new Command("(.+)", 1));
    sayTitleBookmark.act = function (params) {
        chrome.tabs.query({currentWindow: true, active: true}, function(result) {
            var url = result[0].url;
            availability({
                type: "bookmark",
                title: params[0],
                url: url
            });
            setTimeout(function () {
                if (available === 1) {
                    if (folder != "") {
                        chrome.bookmarks.search({title: folder}, function (BookmarkTreeNodesFolder) {
                            if (BookmarkTreeNodesFolder.length > 0) {
                                for (var i = 0; i < BookmarkTreeNodesFolder.length; i++) {
                                    if (BookmarkTreeNodesFolder[i].url === undefined) {
                                        chrome.bookmarks.create({
                                            parentId: BookmarkTreeNodesFolder[i].id,
                                            title: params[0],
                                            url: url
                                        });
                                        say("I added the bookmark " + params[0] + " to your folder, " + folder);
                                        notify("Added bookmark " + params[0] + " to folder " + folder);
                                    }
                                }
                            }
                        });
                    } else {
                        chrome.bookmarks.getTree(function (results) {
                            chrome.bookmarks.create({
                                parentId: results[0].children[0].id,
                                title: params[0],
                                url: url
                            });
                        });
                        say("I added the bookmark " + params[0] + " to your library");
                        notify("Added bookmark " + params[0] + " to library");
                    }
                }
            }, 10);
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
    folderState.addAction(openBookmark);

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
    addFolder.addCommand(new Command("add new folder", 0));
    addFolder.act = function () {
        folder = "";
    };
    this.addAction(addFolder);

    /**
     * add folder in folder
     * @type {Action}
     */
    var addFolderInFolder = new Action("addFolderInFolder", 1, folderListenState);
    addFolderInFolder.addCommand(new Command("create new folder in (.*)", 1));
    addFolderInFolder.act = function (params) {
        interacting(params[0], "folder", "open");
        folder = params[0];
    };
    this.addAction(addFolderInFolder);

    /**
     * say title for folder
     * @type {Action}
     */
    var sayTitleFolder = new Action("sayTitleFolder", 1, globalCommonState);
    sayTitleFolder.addCommand(new Command("(.+)", 1));
    sayTitleFolder.act = function (params) {
        availability({
            title: params[0]
        });
        setTimeout(function () {
            if (available === 1) {
                if (folder != "") {
                    chrome.bookmarks.search({title: folder}, function (BookmarkTreeNodesFolder) {
                        if (BookmarkTreeNodesFolder.length > 0) {
                            for (var i = 0; i < BookmarkTreeNodesFolder.length; i++) {
                                if (BookmarkTreeNodesFolder[i].url === undefined) {
                                    chrome.bookmarks.create({
                                        parentId: BookmarkTreeNodesFolder[i].id,
                                        title: params[0]
                                    });
                                    say("I added the folder " + params[0] + " to your folder, " + folder);
                                    notify("Added folder " + params[0] + " to folder " + folder);
                                }
                            }
                        }
                    });
                } else {
                    chrome.bookmarks.getTree(function (results) {
                        chrome.bookmarks.create({
                            parentId: results[0].children[0].id,
                            title: params[0]
                        });
                    });
                    say("I added the folder " + params[0] + " to your library");
                    notify("Added folder " + params[0] + " to library");
                }
            }
        }, 10);
    };
    folderListenState.addAction(sayTitleFolder);

    /**
     * open folder
     * @type {Action}
     */
    var openFolder = new Action("openFolder", 1, folderState);
    openFolder.addCommand(new Command("show content of (.*)", 1));
    openFolder.act = function (params) {
        interacting(params[0], "folder", "open");
        setTimeout(function () {
            if (interact === 1) {
                chrome.bookmarks.search({title: params[0]}, function (BookmarkTreeNodes) {
                    for (var i = 0; i < BookmarkTreeNodes.length; i++) {
                        if (BookmarkTreeNodes[i].url === undefined) {
                            var kids = "";
                            chrome.bookmarks.getChildren(BookmarkTreeNodes[i].id, function (children) {
                                if (children.length > 0) {
                                    var kidFolder = [];
                                    var kidBookmark = [];
                                    for (var i = 0; i < children.length; i++) {
                                        if (children[i].url === undefined) {
                                            kidFolder.push(children[i]);
                                        } else {
                                            kidBookmark.push(children[i]);
                                        }
                                    }
                                    kids = children;
                                    var send = {title: params[0], kidFolder: kidFolder, kidBookmark: kidBookmark};
                                    callContentScriptMethod("showFolder", send);
                                    if (kidBookmark.length > 1) {
                                        say("Your folder " + params[0] + " contains " + kidBookmark.length + "bookmarks and " + kidFolder.length + " folder");
                                    } else {
                                        say("Your folder " + params[0] + " contains " + kidBookmark.length + "bookmark and " + kidFolder.length + " folder");
                                    }
                                } else {
                                    notify("The folder is empty");
                                    say("The folder " + params + " is empty");
                                }
                            });
                        }
                    }
                });
            }
        }, 10);
    };
    this.addAction(openFolder);
    folderState.addAction(openFolder);

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
