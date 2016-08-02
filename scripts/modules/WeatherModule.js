addModule(new Module("WeatherModule", function() {
	var showWeatherOf = new Action("Show Weather of ?", 1, globalCommonState);
	showWeatherOf.addCommand(new Command("weather (.+)", 1));
	showWeatherOf.addCommand(new Command("weather of (.+)", 1));
	showWeatherOf.addCommand(new Command("show weather of (.+)", 1));
	showWeatherOf.act = function(arguments) {
		var city = arguments[0];
		var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text=%22" + city + "%22)&format=json";

		notify("Weather", 0, function(messageId) {
			callContentScriptMethod("showWeather", {"api":"yahoo", "elementId":messageId, "url":url});
		});
	};
	this.addAction(showWeatherOf);
}));