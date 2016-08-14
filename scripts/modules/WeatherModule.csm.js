addContentScriptMethod(
	new ContentScriptMethod("showWeather", function(params) {
		console.log(params.weatherObject);
		//load html
		$("#ChromeSpeechControlPanel")
			.attr("style", "display:block")
			.load(chrome.extension.getURL("scripts/modules/WeatherModule.html"), function() {
				$("#weatherImage").attr("src", params.weatherObject.image);
				$("#weatherTitle").html(params.weatherObject.city + " (" + params.weatherObject.country + ")");
				$("#weatherDate").html(params.weatherObject.date);
				$("#weatherContent").html(params.weatherObject.conditionText + ", " + params.weatherObject.temp + " " + params.weatherObject.tempUnit + "°");
			});

	})
);
