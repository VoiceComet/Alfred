addModule(new Module("SearchEngineModule", function() {

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

			/**
			 * Show a message and say that no search results found
			 * @param query
			 */
			function showNoResultsFound(query) {
				notify("I cannot find " + query);
				say("I cannot find " + query);
			}

			/**
			 * Show a message and say that no search results found
			 * @param error
			 */
			function showSearchEngineError(error) {
				console.log("Search Engine Request Failed: " + error );
				notify("The Search Engine does not work.");
				say("The Search Engine does not work");
			}

			var that = this;
			if (arguments.length >= 1) {
				this.query = arguments[0];
			}

			if (!(activeState.oldState instanceof PanelState)) {
				notify("Searching \"" + this.query + "\" ...");
			}

			//std value is google
			chrome.storage.sync.get({
				searchEngine: 'google'
			}, function(items) {
				//noinspection JSUnresolvedVariable
				var api = items.searchEngine; //get setting
				var searchResultObject = null;
				var url;

				//choose api
				if (api == "google") {
					url = "https://www.googleapis.com/customsearch/v1" +
						"?q=" + that.query +
						"&cx=007862407823870520051%3A9d-mxwotd6i&key=AIzaSyAD-XJsCGm_N1cAfYeuTwgsiFp0iWgcAi0" +
						"&num=" + that.maxResults +
						'&start=' + (that.start + 1); //not zero based

					//noinspection JSUnresolvedFunction
					$.getJSON(url, function(json) {
						//console.log(json);

						//translate google json to alfreds json
						//noinspection JSUnresolvedVariable
						if (json != null) {
							//noinspection JSUnresolvedVariable
							searchResultObject = {
								"searchTerm" : json.queries.request[0].searchTerms,
								"searchTime" : json.searchInformation.formattedSearchTime,
								"searchTotalResults" : json.searchInformation.formattedTotalResults,
								"page" : that.start / that.maxResults,
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
									"startIndex" : json.queries.nextPage[0].startIndex  - 1,
									"page" : (json.queries.nextPage[0].startIndex - 1) / that.maxResults
								};
							}

							//previous
							//noinspection JSUnresolvedVariable
							if (json.queries.hasOwnProperty('previousPage') && json.queries.previousPage.length > 0) {
								//noinspection JSUnresolvedVariable
								searchResultObject.previousPage = {
									"startIndex" : json.queries.previousPage[0].startIndex - 1,
									"page" : (json.queries.previousPage[0].startIndex - 1) / that.maxResults
								};
							}

						} else {
							showNoResultsFound(query);
						}

						that.afterLoading(searchResultObject);
					}).fail(function(jqxhr, textStatus, error ) {
						showSearchEngineError(textStatus + ", " + error);
					});
				} else if (api == "bing") {
					url = "https://api.cognitive.microsoft.com/bing/v5.0/search" +
						"?q=" + that.query +
						"&count=" + that.maxResults +
						"&offset=" + that.start;

					//getJson cannot set headers
					$(document).ready(function() {
						$.ajax({
							url: url,
							type: 'GET',
							dataType: 'json',
							beforeSend: function(xhr) {
								xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '5f37efca5e0641d884902129d20db859');
							},
							success: function(json) {
								//console.log(json);

								//translate bing json to alfreds json
								if (json != null) {
									//noinspection JSUnresolvedVariable
									searchResultObject = {
										"searchTerm" : that.query,
										"searchTime" : -1,
										"searchTotalResults" : json.webPages.totalEstimatedMatches,
										"page" : that.start / that.maxResults,
										"items" : []
									};

									//noinspection JSUnresolvedVariable
									for (var i = 0; i < json.webPages.value.length; i++) {
										//noinspection JSUnresolvedVariable
										searchResultObject.items[i] = {
											"link" : json.webPages.value[i].url,
											"formattedUrl" : json.webPages.value[i].displayUrl,
											"snippet" : json.webPages.value[i].snippet,
											"title" : json.webPages.value[i].name
										};
									}

									//next
									//noinspection JSUnresolvedVariable
									if (that.start + that.maxResults <= json.webPages.totalEstimatedMatches) {
										searchResultObject.nextPage = {
											"startIndex" : that.start + that.maxResults,
											"page" : (that.start + that.maxResults) / that.maxResults
										};
									}

									//previous
									//noinspection JSUnresolvedVariable
									if (that.start > 1) {
										//noinspection JSUnresolvedVariable
										searchResultObject.previousPage = {
											"startIndex" : that.start - that.maxResults,
											"page" : (that.start - that.maxResults) / that.maxResults
										};
									}

								} else {
									showNoResultsFound(query);
								}

								that.afterLoading(searchResultObject);
							},
							error: function(jqXHR, textStatus, error) {
								showSearchEngineError(textStatus + ", " + error);
							}
						});
					});

				}
			});

			//generate following state
			this.followingState = new PanelState("Search State");
			this.followingState.init = function () {
				//hide panel with cancel action
				//noinspection JSUnusedLocalSymbols
				this.cancelAction.act = function (params) {
					callContentScriptMethod("hidePanel", {});
					notify("canceled");
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.followingState = globalCommonState;
				};
			};
		};

		this.afterLoading = function (searchResultObject) {
			//console.log(searchResultObject);

			if (searchResultObject != null) {
				//show results
				callContentScriptMethod("showSearchResults", {"searchResultObject":searchResultObject});
				//reset scrolling
				callContentScriptMethod("elementResetScrolling", {"id":"ChromeSpeechControlPanel"});

				if (!(activeState.oldState instanceof PanelState)) {
					say(searchResultObject.searchTotalResults + " results found");
				}

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

			//add search actions
			addSearchEngineActions(this.followingState);
		};
	}


	/**
	 * add web search action and language web search action to given state or module
	 * @param {Module|State} stateOrModule
	 */
	function addSearchEngineActions(stateOrModule) {
		var searchEngineAction = new SearchAction("WebSearch", 1, null); //state is set during act function
		searchEngineAction.addCommands([
			new Command("web search (.+)", 1),
			new Command("websearch (.+)", 1),
			new Command("google (.+)", 1),
			new Command("bing (.+)", 1)
		]);
		searchEngineAction.maxResults = maxResults;
		searchEngineAction.start = 0;
		searchEngineAction.query = "empty";
		stateOrModule.addAction(searchEngineAction);

		var languageSearchEngineAction = new MultilingualAction("LanguageWebSearch", searchEngineAction);
		languageSearchEngineAction.addCommands([
			new Command("language web search", 0),
			new Command("language websearch", 0),
			new Command("language google", 0),
			new Command("language bing", 0)
		]);
		stateOrModule.addAction(languageSearchEngineAction);
	}

	addSearchEngineActions(this);

}));