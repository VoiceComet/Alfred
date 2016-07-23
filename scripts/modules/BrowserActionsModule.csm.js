
addContentScriptMethod(
	new ContentScriptMethod("goBack", function() { //function(params) {
		window.history.back();
	})
);

addContentScriptMethod(
	new ContentScriptMethod("goForward", function() { //function(params) {
		window.history.forward();
	})
);

