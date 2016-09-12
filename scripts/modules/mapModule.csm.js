/**
 * runs a given function on front page, you can use the variable map here
 * @param {Function} method
 */
function runMethodOnPage(method) {
	var script = document.createElement('script');
	script.appendChild(document.createTextNode('('+ method +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
}

/**
 * show map in panel
 */
addContentScriptMethod(
    new ContentScriptMethod("openMap", function () {
        var panelParams = {};
        panelParams.time = 0;
        panelParams.cancelable = false;
        panelParams.fullHeight = true;

		//add map div and needed javascript to front page
		jQuery.get(chrome.extension.getURL("scripts/modules/mapModule.html"), function(content) {
			panelParams.html = content;
			showPanel(panelParams);
		});

    })
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomIn", function() {
		runMethodOnPage(function() {
			console.log(alfredMap);
			//noinspection JSUnresolvedVariable
			alfredMap.setZoom(alfredMap.getZoom() + 1);
		});
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomOut", function() {
		runMethodOnPage(function() {
			//noinspection JSUnresolvedVariable
			alfredMap.setZoom(alfredMap.getZoom() - 1);
		});
	})
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollUp", function() {
		runMethodOnPage(function() {
			//noinspection JSUnresolvedVariable,JSUnresolvedFunction
			alfredMap.panBy(0, -200);
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollDown", function() {
		runMethodOnPage(function() {
			//noinspection JSUnresolvedVariable,JSUnresolvedFunction
			alfredMap.panBy(0, 200);
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollLeft", function() {
		runMethodOnPage(function() {
			//noinspection JSUnresolvedVariable,JSUnresolvedFunction
			alfredMap.panBy(-150, 0);
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollRight", function() {
		runMethodOnPage(function() {
			//noinspection JSUnresolvedVariable,JSUnresolvedFunction
			alfredMap.panBy(150, 0);
		});
    })
);