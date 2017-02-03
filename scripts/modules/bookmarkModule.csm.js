/**
 * csm for bookmarkModule
*/

/**
 * open folder in panel
 */
addContentScriptMethod(
    new ContentScriptMethod("showFolder", function (params) {
        var html = '<b>' + translate("contentOfFolder").format([params.title]) + '</b><br/>';
        html += '</span><br/>';
        for (var i = 0; i < params.kidBookmark.length; i++) {
            html += '<br/>';
            html += '<span class="SearchEngineResultTitle">' + params.kidBookmark[i].title + '</span><br/>';
            html += '<span class="SearchEngineResultUrl">' + params.kidBookmark[i].url + '</span><br/>';
        }
        for (var j = 0; j < params.kidFolder.length; j++) {
            html += '<br/>';
            html += '<span class="SearchEngineResultTitle">' + params.kidFolder[j].title + '</span><br/>';
        }
        var panelParams = {html:html, time:0, cancelable: true};
        showPanel(panelParams);
    })
);