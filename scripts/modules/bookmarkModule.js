/**
 * Module for creating and interacting with bookmarks
 */

addModule(new Module("bookmarkModule", function () {

    var folder = "";
    var available = true;
    var interact = true;

    /**
     * state for interacting with folder content
     */
    var folderState = new PanelState("folderState");
    folderState.init = function () {
        this.cancelAction.cancelAct = function() {
            callContentScriptMethod("hidePanel", {});
            say(translate("stoppedRummagingInLibrary"));
        };
    };

    /**
     * state which listens for bookmark title
     */
    var bookmarkListenState = new State("bookmarkListenState");
    bookmarkListenState.init = function () {
      notify(translate("sayTitleOfNewBookmark"));
      say(translate("sayTitleOfNewBookmark"));
      this.cancelAction.cancelAct = function () {
          notify(translate("stoppedCreatingBookmark"));
          say(translate("stoppedCreatingBookmark"));
      }
    };

    /**
     * state which listens for folder title
     */
    var folderListenState = new State("folderListenState");
    folderListenState.init = function () {
        notify(translate("sayTitleOfNewFolder"));
        say(translate("sayTitleOfNewFolder"));
        this.cancelAction.cancelAct = function () {
            notify(translate("stoppedCreatingFolder"));
            say(translate("stoppedCreatingFolder"));
        }
    };

    /**
     * function to get all combinations of a string
     * @param {String} params
     */
    var combinations = function (params) {
        var outputString = [];
        var inputArrayLowerCase = [];
        var inputArrayUpperCase = [];
        var inputString = params.toString();
        for (var j = 0; j < inputString.length; j++) {
            inputArrayLowerCase.push(inputString.charAt(j).toLowerCase());
            inputArrayUpperCase.push(inputString.charAt(j).toUpperCase());
        }
        for (var k = 0; k < inputArrayLowerCase.length; k++) {
            if (k === 0) {
                outputString[0] = inputArrayLowerCase[0];
                outputString[1] = inputArrayUpperCase[0];
            } else {
                for (var m = 0; m < Math.pow(2, k + 1); m++) {
                    var newString = "";
                    if (m < Math.pow(2, k)){
                        newString = outputString[m].substr(0, k) +  inputArrayLowerCase[k] + outputString[m].substr(k + 1);
                    } else {
                        newString = outputString[m - Math.pow(2, k)].substr(0, k) +  inputArrayUpperCase[k] + outputString[m - Math.pow(2, k)].substr(k + 1);
                    }
                    outputString[m] = newString;
                }
            }
        }
        return outputString
    };

    /**
     * function for all possible folder titles
     * @param {String} title
     */
    var allFolder = function (title) {
        var result = combinations(title);
        for (var i = 0; i < result.length; i++) {
            chrome.bookmarks.search({title: result[i]}, function (BookmarkTreeNodesFolder) {
                if (BookmarkTreeNodesFolder.length > 0) {
                    for (var j = 0; j< BookmarkTreeNodesFolder.length; j++) {
                        if (BookmarkTreeNodesFolder[j].url === undefined) {
                            folder = BookmarkTreeNodesFolder[j].title;
                            return;
                        }
                    }
                }
            });
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
        var hit = 0;
        available = true;
        var result = combinations(object.title);
        for (var j = 0; j < result.length; j++) {
            if (object.type === "bookmark") {
                chrome.bookmarks.search({title: result[j]}, function (BookmarkTreeNodesBookmark) {
                    if(hit != 0) {
                        return;
                    }
                    if (BookmarkTreeNodesBookmark.length > 0) {
                        for (var i = 0; i < BookmarkTreeNodesBookmark.length; i++) {
                            if (BookmarkTreeNodesBookmark[i].url != undefined) {
                                hit++;
                                available = false;
                                say(translate("sayBookmarkNameTaken"));
                                notify(translate("notifyBookmarkNameTaken"));
                            }
                        }
                    } else {
                        chrome.bookmarks.search({url: object.url}, function (BookmarkTreeNodesUrl) {
                            if (hit != 0) {
                                return;
                            }
                            if (BookmarkTreeNodesUrl.length > 0) {
                                hit++;
                                available = false;
                                say(translate("sayBookmarkUrlTaken"));
                                notify(translate("notifyBookmarkUrlTaken"));
                            }
                        });
                    }
                });
            } else {
                chrome.bookmarks.search({title: result[j]}, function (BookmarkTreeNodesFolder) {
                    if(hit != 0) {
                        return;
                    }
                    if (BookmarkTreeNodesFolder.length > 0) {
                        for (var i = 0; i < BookmarkTreeNodesFolder.length; i++) {
                            if (BookmarkTreeNodesFolder[i].url === undefined) {
                                hit++;
                                available = false;
                                say(translate("sayFolderNameTaken"));
                                notify(translate("notifyFolderNameTaken"));
                            }
                        }
                    }
                });
            }
        }
    };

    /**
     * function to interact with bookmarks/folders
     * @param {String} title - the title which should be verified
     * @param {String} object - interact with bookmark or folder
     * @param {String} action - remove or open object
     */
    var interacting = function (title, object, action) {
        var hit = 0;
        interact = true;
        var result = combinations(title);
        for (var j = 0; j < result.length; j++) {
            chrome.bookmarks.search({title: result[j]}, function (BookmarkTreeNodes) {
                if (hit != 0) {
                    return;
                }
                if (object === "bookmark"){
                    for (var i = 0; i < BookmarkTreeNodes.length; i++) {
                        if (BookmarkTreeNodes[i].url != undefined) {
                            hit++;
                            if (action === "open") {
                                chrome.tabs.update({url: BookmarkTreeNodes[i].url, active: true});
                            } else {
                                chrome.bookmarks.remove(BookmarkTreeNodes[i].id);
                                say(translate("sayRemovedBookmark").format([BookmarkTreeNodes[i].title]));
                                notify(translate("notifyRemovedBookmark").format([BookmarkTreeNodes[i].title]));
                            }
                            if (hit != 0) {
                                return;
                            }
                        }
                    }
                } else {
                    for (var k = 0; k < BookmarkTreeNodes.length; k++) {
                        if (BookmarkTreeNodes[k].url === undefined) {
                            hit++;
                            if (action != "open") {
                                chrome.bookmarks.removeTree(BookmarkTreeNodes[k].id);
                                say(translate("sayRemovedFolder").format([BookmarkTreeNodes[k].title]));
                                notify(translate("notifyRemovedFolder").format([BookmarkTreeNodes[k].title]));
                            }
                            if (hit != 0) {
                                return;
                            }
                        }
                    }
                }
            });
        }
        setTimeout(function () {
            if (hit <= 0) {
                interact = false;
                say(translate("sayThereIsNoObjectX").format([object, title]));
                notify(translate("notifyThereIsNoObjectX").format([object, title]));
            }
        }, 10);
    };

    /**
     * add bookmark
     * @type {Action}
     */
    var addBookmark = new Action("addBookmark", 0, bookmarkListenState);
    addBookmark.act = function () {
        folder = "";
    };
    this.addAction(addBookmark);

    /**
     * add bookmark to folder
     * @type {Action}
     */
    var addBookmarkToFolder = new Action("addBookmarkToFolder", 1, bookmarkListenState);
    addBookmarkToFolder.act = function (params) {
        interacting(params[0], "folder", "open");
        setTimeout(function () {
            if (interact != false) {
                allFolder(params[0]);
            }
        }, 10);
    };
    this.addAction(addBookmarkToFolder);

    /**
     * say title for bookmark
     * @type {Action}
     */
    var sayTitleBookmark = new Action("sayTitleBookmark", 1, globalCommonState);
    sayTitleBookmark.act = function (params) {
        chrome.tabs.query({currentWindow: true, active: true}, function(result) {
            var url = result[0].url;
            availability({
                type: "bookmark",
                title: params[0],
                url: url
            });
            setTimeout(function () {
                if (available != false) {
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
                                        say(translate("sayAddedBookmarkXToFolderY").format([params[0], folder]));
                                        notify(translate("notifyAddedBookmarkXToFolderY").format([params[0], folder]));
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
                        say(translate("sayAddedBookmarkX").format([params[0]]));
                        notify(translate("notifyAddedBookmarkX").format([params[0]]));
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
    openBookmark.act = function (params) {
        interacting(params[0], "bookmark", "open");
    };
    this.addAction(openBookmark);
    folderState.addAction(openBookmark);

    /**
     * remove bookmark
     * @type {Action}
     */
    var removeBookmark = new Action("removeBookmark", 1, globalCommonState);
    removeBookmark.act = function (params) {
        interacting(params[0], "bookmark", "remove");
    };
    this.addAction(removeBookmark);

    /**
     * add folder
     * @type {Action}
     */
    var addFolder = new Action("addFolder", 0, folderListenState);
    addFolder.act = function () {
        folder = "";
    };
    this.addAction(addFolder);

    /**
     * add folder in folder
     * @type {Action}
     */
    var addFolderInFolder = new Action("addFolderInFolder", 1, folderListenState);
    addFolderInFolder.act = function (params) {
        interacting(params[0], "folder", "open");
        setTimeout(function () {
            if (interact != false) {
                allFolder(params[0]);
            }
        }, 10);
    };
    this.addAction(addFolderInFolder);

    /**
     * say title for folder
     * @type {Action}
     */
    var sayTitleFolder = new Action("sayTitleFolder", 1, globalCommonState);
    sayTitleFolder.act = function (params) {
        availability({
            title: params[0]
        });
        setTimeout(function () {
            if (available != false) {
                if (folder != "") {
                    chrome.bookmarks.search({title: folder}, function (BookmarkTreeNodesFolder) {
                        if (BookmarkTreeNodesFolder.length > 0) {
                            for (var i = 0; i < BookmarkTreeNodesFolder.length; i++) {
                                if (BookmarkTreeNodesFolder[i].url === undefined) {
                                    chrome.bookmarks.create({
                                        parentId: BookmarkTreeNodesFolder[i].id,
                                        title: params[0]
                                    });
                                    say(translate("sayAddedFolderXToFolderY").format([params[0], folder]));
                                    notify(translate("notifyAddedFolderXToFolderY").format([params[0], folder]));
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
                    say(translate("sayAddedFolderX").format([params[0]]));
                    notify(translate("notifyAddedFolderX").format([params[0]]));
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
    openFolder.act = function (params) {
        interacting(params[0], "folder", "open");
        setTimeout(function () {
            if (interact != false) {
                allFolder(params[0]);
                setTimeout(function () {
                    chrome.bookmarks.search({title: folder}, function (BookmarkTreeNodes) {
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
                                        var send = {title: folder, kidFolder: kidFolder, kidBookmark: kidBookmark};
                                        callContentScriptMethod("showFolder", send);
                                        if (kidBookmark.length > 1) {
                                            say(translate("sayFolderXContainsYBookmarksZFolders").format([folder, kidBookmark.length, kidFolder.length]));
                                        } else {
                                            say(translate("sayFolderXContainsOneBookmarkYFolders").format([folder, kidFolder.length]));
                                        }
                                    } else {
                                        say(translate("notifyEmptyFolder").format([folder]));
                                        notify(translate("notifyEmptyFolder"));
                                    }
                                });
                            }
                        }
                    });
                }, 10);
            }
        }, 10);
    };
    this.addAction(openFolder);
    folderState.addAction(openFolder);

    /**
     * remove folder
     * @type {Action}
     */
    var removeFolder = new Action("removeFolder", 1, globalCommonState);
    removeFolder.act = function (params) {
        interacting(params[0], "folder", "remove");
    };
    this.addAction(removeFolder);

}));
