/**
 * csm for creating and interacting with bookmarks
 */

addContentScriptMethod(
    new ContentScriptMethod("addBookmark", function () {
        showMessage({content: "please say a title for the new bookmark"});
    })
);