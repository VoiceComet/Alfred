
addContentScriptMethod(
	new ContentScriptMethod("goBack", function() { //function(params) {
		alert("back");
		window.history.back();
	})
);

addContentScriptMethod(
	new ContentScriptMethod("goForward", function() { //function(params) {
		alert("vor");
		window.history.forward();
	})
);

