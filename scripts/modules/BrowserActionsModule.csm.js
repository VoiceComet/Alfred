//scrolling factors
var scrollHeightFactor = 0.7;
var scrollWidthFactor = 0.7;

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

addContentScriptMethod(
	new ContentScriptMethod("scrollToTop", function() { //function(params)
		//currently not on top of the page -> set scrollPosVertical
		var scrollPosVertical = window.scrollY;
		if(scrollPosVertical != 0) {
			$("html, body").animate({scrollTop: 0});
		//on top of the page
		} else {
			alert("This is the top of the page");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToBottom", function() { //function(params)
		//currently not on the bottom of the page -> set scrollPosVertical, set bottom
		var scrollHeight = window.innerHeight * scrollHeightFactor;
		var bottom = document.body.scrollHeight - window.innerHeight;
		var scrollPosVertical = window.scrollY;
		if(scrollPosVertical < bottom) {
			$("html, body").animate({scrollTop: document.body.scrollHeight - scrollHeight});
		//on the bottom of the page
		} else {
			alert("This is the bottom of the page");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollUp", function() { //function(params)
		var scrollHeight = window.innerHeight * scrollHeightFactor;
		var scrollPosVertical = window.scrollY;
		//scrolling up will not reach the top of the page -> scroll up
		if(scrollPosVertical > 0) {
			$("html, body").animate({scrollTop: scrollPosVertical - scrollHeight});
		//Position of scrolling is on top of the page -> set control variables = 0, alert
		} else {
			alert("scrolling up isn't possible");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollDown", function() { //function(params)
		var scrollHeight = window.innerHeight * scrollHeightFactor;
		var bottom = document.body.scrollHeight - window.innerHeight;
		var scrollPosVertical = window.scrollY;
		//scrolling down will not reach the bottom of the page -> scroll down
		if(scrollPosVertical < bottom) {
			$("html, body").animate({scrollTop: scrollPosVertical + scrollHeight});
		//Position of scrolling is on the bottom of the page -> set control variables = document.body.scrollHeight - window.innerHeight, alert
		} else {
			alert("scrolling down isn't possible");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollLeft", function() { //function(params)
		var scrollWidth = window.innerWidth * scrollWidthFactor;
		var scrollPosHorizontal = window.scrollX;
		//scrolling left will not reach the left end of the page -> scroll left
		if(scrollPosHorizontal > 0) {
			$("html, body").animate({scrollLeft: scrollPosHorizontal - scrollWidth});
		//Position of scrolling is on the left end of the page -> set control variables = 0, alert
		} else {
			alert("scrolling left isn't possible");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollRight", function() { //function(params)
		var scrollWidth = window.innerWidth * scrollWidthFactor;
		var rightEnd = document.body.scrollWidth - window.innerWidth;
		var scrollPosHorizontal = window.scrollX;
		//scrolling right will not reach the right end of the page -> scroll right
		if(scrollPosHorizontal < rightEnd) {
			$("html, body").animate({scrollLeft: scrollPosHorizontal + scrollWidth});
		//Position of scrolling is on the right end of the page -> set control variables = document.body.scrollWidth, alert
		} else {
			alert("scrolling right isn't possible");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToRead", function() { //function(params)
		$("html, body").animate({ scrollTop: 100}, 30);
	})
);

