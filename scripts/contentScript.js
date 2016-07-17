//noinspection JSUnusedLocalSymbols
/**
 * Handle requests from background.html
 */
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar")
		toggleSidebar();
}
chrome.runtime.onMessage.addListener(handleRequest);

var sidebarOpen = false;
/**
 * Small function which create a sidebar(just to illustrate my point)
 */
function toggleSidebar() {
	if(sidebarOpen) {
		var el = document.getElementById('mySidebar');
		el.parentNode.removeChild(el);
		sidebarOpen = false;
	}
	else {
		var sidebar = document.createElement('div');
		sidebar.id = "mySidebar";
		sidebar.innerHTML = "\
			<h1>Hello</h1>\
			World!\
		";
		sidebar.style.cssText = "\
			position:fixed;\
			top:0px;\
			right:0px;\
			width:30%;\
			height:100%;\
			background:white;\
			box-shadow:inset 0 0 1em black;\
			z-index:999999;\
		";
		document.body.appendChild(sidebar);
		sidebarOpen = true;
	}
}