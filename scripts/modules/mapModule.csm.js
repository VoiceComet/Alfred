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
		panelParams.noPadding = true;

		//add map div and needed javascript to front page
		jQuery.get(chrome.extension.getURL("scripts/frontendMessaging.js"), function(frontendMessagingContent) {
			jQuery.get(chrome.extension.getURL("scripts/modules/mapModule.html"), function(mapModuleContent) {
				//noinspection JSUnusedLocalSymbols
				panelParams.html = "<script type=\"text/javascript\">\n";
				panelParams.html += "var languageJson = " + JSON.stringify(languageJson) + ";\n";
				panelParams.html += frontendMessagingContent;
				panelParams.html += "\n</script>\n";
				panelParams.html += mapModuleContent;
				showPanel(panelParams);
			});
		});
    })
);

addContentScriptMethod(
	new ContentScriptMethod("closeMap", function(params) {
		runMethodOnPage(function() {
			clearMarkers();
			clearDisplayedRoute();
		}, params);
	})
);

addContentScriptMethod(
	new ContentScriptMethod("resizeMap", function(params) {
		runMethodOnPage(function() {
			var center = alfredMap.getCenter();
			google.maps.event.trigger(alfredMap, "resize");
			alfredMap.panTo(center);
		}, params);
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
	new ContentScriptMethod("mapSearchRoute", function(params) {
		runMethodOnPage(function(params) {
			searchRouteOnAlfredMap(params.origin, params.destination);
		}, params);
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomToMarker", function(params) {
		runMethodOnPage(function(params) {
			var letter = params.marker.toUpperCase();
			var letterPos = alfredMapMarkerLabels.indexOf(letter);
			if (letterPos >= 0 && letterPos < alfredMapMarkerLabels.length && letterPos < alfredMapMarkers.length) {

				// the smooth zoom function
				function smoothZoom (map, max, cnt) {
					if (cnt < max) {
						var z = google.maps.event.addListener(map, 'zoom_changed', function(){
							google.maps.event.removeListener(z);
							smoothZoom(map, max, cnt + 1);
						});
						map.setZoom(cnt);
					}
				}

				if (alfredMap.getCenter().equals(alfredMapMarkers[letterPos].marker.getPosition())) {
					//zoom only
					smoothZoom(alfredMap, alfredMap.getZoom() + 3, alfredMap.getZoom());
				} else {
					//change center
					var z = google.maps.event.addListener(alfredMap, 'center_changed', function() {
						google.maps.event.removeListener(z);
						smoothZoom(alfredMap, alfredMap.getZoom() + 3, alfredMap.getZoom());
					});
					alfredMap.panTo(alfredMapMarkers[letterPos].marker.getPosition());
				}
				showMessage({title:alfredMapMarkers[letterPos].name, content:alfredMapMarkers[letterPos].address});
			} else {
				showMessage({content:translate("LetterXDoesNotExist").format([letter]), centered: true});
			}
		}, params);
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapCenterMarker", function(params) {
		runMethodOnPage(function(params) {
			var letter = params.marker.toUpperCase();
			var letterPos = alfredMapMarkerLabels.indexOf(letter);
			if (letterPos >= 0 && letterPos < alfredMapMarkerLabels.length && letterPos < alfredMapMarkers.length) {
				alfredMap.panTo(alfredMapMarkers[letterPos].marker.getPosition());
				showMessage({title:alfredMapMarkers[letterPos].name, content:alfredMapMarkers[letterPos].address});
			} else {
				showMessage({content:translate("LetterXDoesNotExist").format([letter]), centered: true});
			}
		}, params);
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomIn", function() {
		runMethodOnPage(function() {
			var oldZoom = alfredMap.getZoom();
			alfredMap.setZoom(alfredMap.getZoom() + 1);
			if (oldZoom >= alfredMap.getZoom()) {
				showMessage({content:translate("ZoomingIsNotPossible"), centered: true});
			}
		});
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomOut", function() {
		runMethodOnPage(function() {
			var oldZoom = alfredMap.getZoom();
			alfredMap.setZoom(alfredMap.getZoom() - 1);
			if (oldZoom <= alfredMap.getZoom()) {
				showMessage({content:translate("ZoomingIsNotPossible"), centered: true});
			}
		});
	})
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollUp", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(0, -200);
			//showMessage({content:"Scrolled up"});
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollDown", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(0, 200);
			//showMessage({content:"Scrolled down"});
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollLeft", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(-150, 0);
			//showMessage({content:"Scrolled left"});
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollRight", function() {
		runMethodOnPage(function() {
			alfredMap.panBy(150, 0);
			//showMessage({content:"Scrolled right"});
		});
    })
);