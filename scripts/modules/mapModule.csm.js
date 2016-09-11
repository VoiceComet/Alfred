/**
 * show map in panel
 */
addContentScriptMethod(
    new ContentScriptMethod("openMap", function () {
        var panelParams = {};
        panelParams.time = 0;
        panelParams.cancelable = false;
        panelParams.fullHeight = true;
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
