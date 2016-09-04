addModule(new Module("WeatherModule", function() {

	//settings
	var maxResults = 10; //google api does not support more than 10 results

	/**
	 * special action for initial search action, next & previous action with predefined act function
	 * @extends Action
	 * @param {String} name - name of action
	 * @param {number} parameterCount - count of parameters
	 * @param {State} followingState - state after action run
	 * @constructor
	 */
	function SearchAction(name, parameterCount, followingState) {
		// Call the parent constructor
		Action.call(this, name, parameterCount, followingState);

		this.act = function(arguments) {
			var that = this;
			if (arguments.length >= 1) {
				this.query = arguments[0];
			}

			notify("Searching \"" + this.query + "\" ...");

			var api = "google";
			var searchResultObject = null;

			//choose api
			if (api == "google") {
				var url = "https://www.googleapis.com/customsearch/v1?q=" + this.query + "&cx=007862407823870520051%3A9d-mxwotd6i&key=AIzaSyAD-XJsCGm_N1cAfYeuTwgsiFp0iWgcAi0&num=" +
					this.maxResults + '&start=' + this.start;

				//noinspection JSUnresolvedFunction
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

						//next
						//noinspection JSUnresolvedVariable
						if (json.queries.hasOwnProperty('nextPage') && json.queries.nextPage.length > 0) {
							//noinspection JSUnresolvedVariable
							searchResultObject.nextPage = {
								"startIndex" : json.queries.nextPage[0].startIndex,
								"page" : (json.queries.nextPage[0].startIndex - 1) / maxResults
							};
						}

						//previous
						//noinspection JSUnresolvedVariable
						if (json.queries.hasOwnProperty('previousPage') && json.queries.previousPage.length > 0) {
							//noinspection JSUnresolvedVariable
							searchResultObject.previousPage = {
								"startIndex" : json.queries.previousPage[0].startIndex,
								"page" : (json.queries.previousPage[0].startIndex - 1) / maxResults
							};
						}

					} else {
						notify("No search results found. Please repeat.");
					}

					that.afterLoading(searchResultObject);
				}).fail(function(jqxhr, textStatus, error ) {
					var err = textStatus + ", " + error;
					console.log( "Request Failed: " + err );
					notify("Search Engine Error: " + err);
				});
			}

			//generate following state
			this.followingState = new PanelState("Search State");
			this.followingState.init = function () {
				//hide panel with cancel action
				//noinspection JSUnusedLocalSymbols
				this.cancelAction.act = function (params) {
					callContentScriptMethod("hidePanel", {});
					notify("canceled");
				};
			};
		};

		this.afterLoading = function (searchResultObject) {
			//console.log(searchResultObject);

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

				//add next action
				if (searchResultObject.hasOwnProperty('nextPage')) {
					var next = new SearchAction("Next", 0, null); //state is set during act function
					next.addCommand(new Command("next", 0));
					next.maxResults = this.maxResults;
					next.start = searchResultObject.nextPage.startIndex;
					next.query = this.query;
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.followingState.addAction(next);
				}

				//add previous action
				if (searchResultObject.hasOwnProperty('previousPage')) {
					var previous = new SearchAction("Previous", 0, null); //state is set during act function
					previous.addCommand(new Command("previous", 0));
					previous.maxResults = this.maxResults;
					previous.start = searchResultObject.previousPage.startIndex;
					previous.query = this.query;
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.followingState.addAction(previous);
				}
			}
		};
	}


	var searchEngineAction = new SearchAction("Search ?", 1, null); //state is set during act function
	searchEngineAction.addCommand(new Command("google (.+)", 1));
	searchEngineAction.maxResults = maxResults;
	searchEngineAction.start = 1;
	searchEngineAction.query = "empty";

	this.addAction(searchEngineAction);
}));