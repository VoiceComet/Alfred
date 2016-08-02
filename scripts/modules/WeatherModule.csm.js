addContentScriptMethod(
	new ContentScriptMethod("showWeather", function(params) {
		if (params.api == "yahoo") {
			$.ajax({
				url: params.url,
				success: function(res) {
					console.log(res);
					//$( "#" + params.elementId ).text( res );
				},
				error: function() {
					hideMessage(params.elementId);
				}
			});
		}
	})
);
