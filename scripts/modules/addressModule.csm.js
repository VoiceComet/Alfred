
addContentScriptMethod(
	new ContentScriptMethod("showAddressResults", function() {
		var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(document.documentElement.innerHTML)[1];

		/** @type RegExp */
		var searched = /\b[\w\döÖüÜäÄß. -]{3,51}(?:\s|\n|\r|\t|<br.*?>)+[\d]{1,4}(?:\s|\n|\r|\t|<br.*?>)*(?:[a-zA-Z])?(?:\s|\n|\r|\t|<br.*?>)+(?:[0][1-9]|[1-9][0-9])[0-9]{3}(?:\s|\n|\r|\t|<br.*?>)+[\w\döÖüÜäÄß -]{3,21}/g;

		/** @type {{String result, String[] parts}[], } */
		var results = [];
		while ((result = searched.exec(bodyHtml)) != null) {
			var parts = result[0].split(/<br.*?>/g);
			results.push({result:result[0], parts:parts});
		}

		var body = $("body");
		body.unmark();

		for (var i = 0; i < results.length; i++) {
			for (var j = 0; j < results[i].parts.length; j++) {
				body.mark(results[i].parts[j], {
					separateWordSearch: false,
					accuracy: "exactly"
				});
			}
		}
	})
);
