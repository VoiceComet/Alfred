addContentScriptMethod(
	new ContentScriptMethod("showWeather", function(params) {
		//console.log(params.weatherObject);
		var that = this;
		//load html
		$("#ChromeSpeechControlPanel")
			.attr("style", "display:block")
			.load(chrome.extension.getURL("scripts/modules/WeatherModule.html"), function() {
				$("#weatherImage").attr("src", params.weatherObject.image);
				$("#weatherTitle").html(params.weatherObject.city + " (" + params.weatherObject.country + ")");
				$("#weatherDate").html(params.weatherObject.date);
				$("#weatherContent").html(params.weatherObject.conditionText + ", " + params.weatherObject.temp + " " + params.weatherObject.tempUnit + "°");

				//clear last timeout
				if (typeof that.weatherTimeoutId != 'undefined' && that.weatherTimeoutId >= 0) {
					clearTimeout(that.weatherTimeoutId);
				}

				//hide after 8 seconds
				that.weatherTimeoutId = setTimeout(function() {
					$("#ChromeSpeechControlPanel").attr("style", "display:none");
					that.weatherTimeoutId = -1;
				}, 8000);
			});

	})
);
