addModule(new Module("WeatherModule", function() {
	var showWeatherOf = new Action("Show Weather of ?", 1, globalCommonState);
	showWeatherOf.addCommand(new Command("weather (.+)", 1));
	showWeatherOf.addCommand(new Command("weather of (.+)", 1));
	showWeatherOf.addCommand(new Command("show weather (.+)", 1));
	showWeatherOf.addCommand(new Command("show weather of (.+)", 1));
	showWeatherOf.act = function(arguments) {
		var city = arguments[0];

		notify("\"" + city + "\" Weather loading...");

		var api = "yahoo";
		if (api == "yahoo") {
			var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text=%22" + city + "%22)&format=json";

			$.getJSON(url, function(json) {
				console.log(json);
				var weatherObject = null;
				//noinspection JSUnresolvedVariable
				if (json.query.results != null) {
					//noinspection JSUnresolvedVariable
					weatherObject = {
						"city":json.query.results.channel.location.city,
						"country":json.query.results.channel.location.country,
						"date":json.query.results.channel.item.condition.date,
						"image":/src="(.+)"/.exec(json.query.results.channel.item.description)[1],
						"conditionText":json.query.results.channel.item.condition.text,
						"temp":json.query.results.channel.item.condition.temp,
						"tempUnit":json.query.results.channel.units.temperature
					};

					callContentScriptMethod("showWeather", {"weatherObject":weatherObject});
				} else {
					notify("No weather result found. Please repeat.");
				}
			});
		}
	};
	this.addAction(showWeatherOf);
}));