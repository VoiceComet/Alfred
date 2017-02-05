addModule(new Module("weatherModule", function() {
	var showWeatherOf = new Action("showWeather", 1, globalCommonState);
	showWeatherOf.act = function(arguments) {

		/**
		 * Show a message and say the weather conditions
		 * @param {Object} weatherObject
		 */
		function showWeatherData(weatherObject) {
			callContentScriptMethod("showWeather", {"weatherObject":weatherObject});
			say(weatherObject.city + ": " + weatherObject.conditionText + " " + translate("and") + " " + weatherObject.temp + " °" + weatherObject.tempUnit);
		}

		/**
		 * Show a message and say that no weather data found
		 * @param {String} city
		 */
		function showNoWeatherDataFound(city) {
			notify(translate("cannotFindWeatherOfX").format([city]));
			say(translate("cannotFindWeather"));
		}

		var city = arguments[0];

		notify(translate("weatherOfXLoading").format([city]));

		var api = "yahoo";
		if (api == "yahoo") {
			var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text=%22" + city + "%22)&format=json";

			$.getJSON(url, function(json, status) {
				console.debug("Weather Status: " + status, json);
				//noinspection JSUnresolvedVariable
				if (json.query.results != null) {
					//noinspection JSUnresolvedVariable
					showWeatherData({
						"city":json.query.results.channel.location.city,
						"country":json.query.results.channel.location.country,
						"date":json.query.results.channel.item.condition.date,
						"image":/src="(.+)"/.exec(json.query.results.channel.item.description)[1],
						"conditionText":json.query.results.channel.item.condition.text,
						"temp":json.query.results.channel.item.condition.temp,
						"tempUnit":json.query.results.channel.units.temperature
					});
				} else {
					showNoWeatherDataFound(city);
				}
			});
		}
	};
	this.addAction(showWeatherOf);
}));