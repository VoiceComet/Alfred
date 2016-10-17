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
        this.cancelAction.act = function() {
            callContentScriptMethod("hidePanel", {});
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
        notify("Which name shall i give the folder");
        say("Which name shall i give the folder");
        this.cancelAction.act = function () {
            notify("canceled folder listen state");
            say("I canceled creating a folder");
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
                                say("There is already a bookmark with the same title in your library");
                                notify("Bookmark title taken");
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
                                say("There is already a bookmark with the same url in your library");
                                notify("Bookmark url taken");
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
                                say("There is already a folder with the same title in your library");
                                notify("Folder title taken");
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
                                say("I removed the bookmark " + BookmarkTreeNodes[i].title + " from your library");
                                notify("Removed bookmark " + BookmarkTreeNodes[i].title + " from library");
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
                                say("I removed the folder " + BookmarkTreeNodes[k].title + " from your library");
                                notify("Removed folder " + BookmarkTreeNodes[k].title + " from library");
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
                say("There is no " + object + ", " + title + " in your library");
                notify("No " + object + " " + title + " found");
            }
        }, 10);
    };

    /**
     * add bookmark
     * @type {Action}
     */
    var addBookmark = new Action("addBookmark", 0, bookmarkListenState);
    addBookmark.addCommand(new Command("add new bookmark", 0));
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
     * remove bookmark
     * @type {Action}
     */
    var removeBookmark = new Action("removeBookmark", 1, globalCommonState);
    removeBookmark.addCommand(new Command("remove bookmark (.*)", 1));
    removeBookmark.act = function (params) {
        interacting(params[0], "bookmark", "remove");
    };
    this.addAction(removeBookmark);

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
    sayTitleFolder.addCommand(new Command("(.+)", 1));
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
                                            say("Your folder " + folder + " contains " + kidBookmark.length + "bookmarks and " + kidFolder.length + " folder");
                                        } else {
                                            say("Your folder " + folder + " contains " + kidBookmark.length + "bookmark and " + kidFolder.length + " folder");
                                        }
                                    } else {
                                        notify("The folder is empty");
                                        say("The folder " + folder + " is empty");
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
    removeFolder.addCommand(new Command("remove folder (.*)", 1));
    removeFolder.act = function (params) {
        interacting(params[0], "folder", "remove");
    };
    this.addAction(removeFolder);

}));
