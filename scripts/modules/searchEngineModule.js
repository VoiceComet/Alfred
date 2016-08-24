addModule(new Module("WeatherModule", function() {

	//settings
	var maxResults = 6;


	//changeable state
	var searchState = new State("Search State");
	searchState.startIndex = 1;
	searchState.init = function () {
		//hide panel with cancel action
		//noinspection JSUnusedLocalSymbols
		this.cancelAction.act = function (params) {
			callContentScriptMethod("hidePanel", {});
			notify("canceled");
		};

		//TODO add next & previous actions
	};



	var searchEngineAction = new Action("Search ?", 1, searchState);
	searchEngineAction.addCommand(new Command("google (.+)", 1));
	searchEngineAction.maxResults = maxResults;
	searchEngineAction.act = function(arguments) {
		var that = this;
		var query = arguments[0];

		notify("Searching \"" + query + "\" ...");

		var api = "google";
		var searchResultObject = null;

		//choose api
		if (api == "google") {
			var url = "https://www.googleapis.com/customsearch/v1?q=" + query + "&cx=007862407823870520051%3A9d-mxwotd6i&key=AIzaSyAD-XJsCGm_N1cAfYeuTwgsiFp0iWgcAi0&num=" + this.maxResults;

			$.getJSON(url, function(json) {
				console.log(json);

				//noinspection JSUnresolvedVariable
				if (json != null) {
					//noinspection JSUnresolvedVariable
					searchResultObject = {
						"searchTerm" : json.queries.request[0].searchTerms,
						"searchTime" : json.searchInformation.formattedSearchTime,
						"searchTotalResults" : json.searchInformation.formattedTotalResults,
						"items" : []
					};

					for (var i = 0; i < json.items.length; i++) {
						//noinspection JSUnresolvedVariable
						searchResultObject.items[i] = {
							"link" : json.items[i].link,
							"formattedUrl" : json.items[i].htmlFormattedUrl,
							"snippet" : json.items[i].htmlSnippet.replace(new RegExp("<br>", "g"), ""),
							"title" : json.items[i].htmlTitle
						};
					}

				} else {
					notify("No search results found. Please repeat.");
				}

				that.afterLoading(searchResultObject);
			});
		}
	};

	searchEngineAction.afterLoading = function (searchResultObject) {
		//console.log(searchResultObject);
		this.followingState.resetActions();


		if (searchResultObject != null) {
			//show results
			callContentScriptMethod("showSearchResults", {"searchResultObject":searchResultObject});

			//create state actions with generated commands
			for (var i = 0; i < searchResultObject.items.length; i++) {
				var action = new Action(i + "", 0, globalCommonState);
				//noinspection JSUnresolvedVariable
				action.resultLink = searchResultObject.items[i].link;
				action.addCommand(new Command((i + 1) + "", 0));
				//noinspection JSUnusedLocalSymbols
				action.act = function (arguments) {
					//open link of search result
					chrome.tabs.update({url: this.resultLink, active: true});
				};
				this.followingState.addAction(action);
			}
		}
	};

	this.addAction(searchEngineAction);
}));