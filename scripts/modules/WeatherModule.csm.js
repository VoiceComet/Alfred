addContentScriptMethod(
	new ContentScriptMethod("showWeather", function(params) {
		if (params.api == "yahoo") {
			$.getJSON(params.url, function(json) {
				console.log(json);
				var text = "No weather result found. Please repeat.";
				//noinspection JSUnresolvedVariable
				if (json.query.results != null) {
					//noinspection JSUnresolvedVariable
					text = json.query.results.channel.item.description.replace("<![CDATA[", "").replace("]]>", "");
				}

				$("#" + params.elementId).html(text);
				setTimeout(function() {
					$("#" + params.elementId).hide(400, function() {
						$(this).remove();
					});
				}, 5000);
			});
		}
	})
);
