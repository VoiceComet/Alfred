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
		panelParams.html = '<div id="map" style="height:100%"></div>' +
			'<script type="text/javascript">' +
			'var map; ' +
			'function initMap() { ' +
				'map = new google.maps.Map(document.getElementById("map"), { ' +
					'center: {lat: -34.397, lng: 150.644}, ' +
					'zoom: 8 ' +
				'}); ' +
			'}'+
			'</script>' +
			'<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAD-XJsCGm_N1cAfYeuTwgsiFp0iWgcAi0&callback=initMap"></script>';

        showPanel(panelParams);
    })
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomIn", function() {
		runMethodOnPage(function() {
			console.log(map);
			//TODO
		});
	})
);

addContentScriptMethod(
	new ContentScriptMethod("mapZoomOut", function() {
		runMethodOnPage(function() {
			console.log(map);
			//TODO
		});
	})
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollUp", function() {
		runMethodOnPage(function() {
			console.log(map);
			//TODO
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollDown", function() {
		runMethodOnPage(function() {
			console.log(map);
			//TODO
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollLeft", function() {
		runMethodOnPage(function() {
			console.log(map);
			//TODO
		});
    })
);

addContentScriptMethod(
    new ContentScriptMethod("mapScrollRight", function() {
		runMethodOnPage(function() {
			console.log(map);
			//TODO
		});
    })
);