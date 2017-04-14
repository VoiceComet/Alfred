addContentScriptMethod(
	new ContentScriptMethod("showSearchResults", function(params) {
		//generate html
		var html = '<b>' + translate("searchResultsForX").format([params.searchResultObject.searchTerm]) + '</b><br/>';
		html += '<span class="SearchEngineResultSnippet">' + translate("results") + ': ' + params.searchResultObject.searchTotalResults;
		if (params.searchResultObject.searchTime >= 0) {
			html += ' ' + translate("timeInXSeconds").format(params.searchResultObject.searchTime);
		}
		html += '</span><br/>';
		for (var i = 0; i < params.searchResultObject.items.length; i++) {
			html += '<br/>';
			html += '<span class="SearchEngineResultTitle">' + (i+1) + ': ' + params.searchResultObject.items[i].title + '</span><br/>';
			html += '<span class="SearchEngineResultUrl">' + params.searchResultObject.items[i].formattedUrl + '</span><br/>';
			html += '<span class="SearchEngineResultSnippet">' + params.searchResultObject.items[i].snippet + '</span><br/>';
		}

		//generate panel parameters
		var panelParams = {"html":html, "time":0};
		if (params.searchResultObject.hasOwnProperty('nextPage')) {
			panelParams.commandRight = translate("next");
		}
		panelParams.infoCenter = " - " + (params.searchResultObject.page + 1) + " - ";
		if (params.searchResultObject.hasOwnProperty('previousPage')) {
			panelParams.commandLeft = translate("previous");
		}
		showPanel(panelParams);
	})
);
