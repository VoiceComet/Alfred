addContentScriptMethod(
	new ContentScriptMethod("showSearchResults", function(params) {
		//generate html
		var html = '<b>Search results for "' + params.searchResultObject.searchTerm + '"</b><br/>';
		html += '<span class="SearchEngineResultSnippet">Results: ' + params.searchResultObject.searchTotalResults + ' Time: ' +
			params.searchResultObject.searchTime + ' s</span><br/>';
		for (var i = 0; i < params.searchResultObject.items.length; i++) {
			html += '<br/>';
			html += '<span class="SearchEngineResultTitle">' + (i+1) + ': ' + params.searchResultObject.items[i].title + '</span><br/>';
			html += '<span class="SearchEngineResultUrl">' + params.searchResultObject.items[i].formattedUrl + '</span><br/>';
			html += '<span class="SearchEngineResultSnippet">' + params.searchResultObject.items[i].snippet + '</span><br/>';
		}

		showPanel({"html":html, "time":0});
	})
);
