/**
 * runs a given function on front page, you can use the variable map here
 * @param {Function} method
 * @param {Object} [params={}]
 */
function runMethodOnPage(method, params) {
	var script = document.createElement('script');
	if (params == 'undefined') params = {};
	script.appendChild(document.createTextNode('('+ method +')(' + JSON.stringify(params) + ');'));
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
	new ContentScriptMethod("mapSearch", function(params) {
		runMethodOnPage(function(params) {
			searchLocationOnAlfredMap(params.query);
		}, params);
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomToMarker", function(params) {
		runMethodOnPage(function(params) {
			var letterPos = markerLabels.indexOf(params.marker.toUpperCase());
			if (letterPos >= 0 && letterPos < markerLabels.length && letterPos < markers.length) {
				alfredMap.setCenter(markers[letterPos].getPosition());
				alfredMap.setZoom(alfredMap.getZoom() + 3);
			}
		}, params);
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapCenterMarker", function(params) {
		runMethodOnPage(function(params) {
			var letterPos = markerLabels.indexOf(params.marker.toUpperCase());
			if (letterPos >= 0 && letterPos < markerLabels.length && letterPos < markers.length) {
				alfredMap.setCenter(markers[letterPos].getPosition());
			}
		}, params);
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomIn", function() {
		runMethodOnPage(function() {
			alfredMap.setZoom(alfredMap.getZoom() + 1);
		});
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomOut", function() {
		runMethodOnPage(function() {
			alfredMap.setZoom(alfredMap.getZoom() - 1);
		});
	})
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollUp", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(0, -200);
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollDown", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(0, 200);
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollLeft", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(-150, 0);
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollRight", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(150, 0);
		});
    })
);