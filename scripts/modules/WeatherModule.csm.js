addContentScriptMethod(
	new ContentScriptMethod("showWeather", function(params) {
		//console.log(params.weatherObject);

		var html = '<img style="float:left; margin-right:15px;" src="' + params.weatherObject.image + '"/>' +
			'<span style="font-weight:bold; margin-bottom:2px;">' + params.weatherObject.city + ' (' + params.weatherObject.country + ')</span><br/>' +
			params.weatherObject.date + '<br/>' +
			params.weatherObject.conditionText + ', ' + params.weatherObject.temp + ' ' + params.weatherObject.tempUnit + '°';

		showPanel({"html":html, "time":8000});
	})
);
