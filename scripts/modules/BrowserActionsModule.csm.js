//variables to control the position of scrolling
var scrollPosVertical = window.scrollY;
var scrollPosHorizontal = window.scrollX;
var checkPosVertical = window.scrollY;
var checkPosHorizontal = window.scrollX;
var scrollHeight = window.innerHeight * 0.7;
var scrollWidth = window.innerWidth *0.7;
var bottom = document.body.scrollHeight - scrollHeight;
var rightEnd = document.body.scrollWidth - scrollWidth;

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
		if(scrollPosVertical != 0) {
			$("html, body").animate({scrollTop: 0});
			scrollPosVertical = 0;
		//on top of the page
		} else {
			alert("This is the top of the page");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToBottom", function() { //function(params)
		//currently not on the bottom of the page -> set scrollPosVertical, set bottom
		if(scrollPosVertical != bottom) {
			$("html, body").animate({scrollTop: document.body.scrollHeight - scrollHeight});
			scrollPosVertical = bottom;
			bottom = document.body.scrollHeight - scrollHeight;
		//on the bottom of the page
		} else {
			alert("This is the bottom of the page");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollUp", function() { //function(params)
		checkPosVertical = scrollPosVertical - scrollHeight;
		//scrolling up will not reach the top of the page -> scroll up
		if(checkPosVertical > 0) {
			scrollPosVertical -= scrollHeight;
			$("html, body").animate({scrollTop: scrollPosVertical});
		//Position of scrolling is on top of the page -> set control variables = 0, alert
		} else if(scrollPosVertical === 0){
			alert("scrolling up isn't possible");
			checkPosVertical = 0;
			scrollPosVertical = 0;
		//scrolling up reaches the top of the page -> set control variables = 0, scroll up
		} else {
			checkPosVertical = 0;
			scrollPosVertical = 0;
			$("html, body").animate({scrollTop: scrollPosVertical});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollDown", function() { //function(params)
		checkPosVertical = scrollPosVertical + scrollHeight;
		//scrolling down will not reach the bottom of the page -> scroll down
		if(checkPosVertical < bottom) {
			scrollPosVertical += scrollHeight;
			$("html, body").animate({scrollTop: scrollPosVertical});
		//Position of scrolling is on the bottom of the page -> set control variables = document.body.scrollHeight - window.innerHeight, alert
		} else if(scrollPosVertical === bottom){
			alert("scrolling down isn't possible");
			checkPosVertical = bottom;
			scrollPosVertical = bottom;
		//scrolling down reaches the bottom of the page -> set control variables = document.body.scrollHeight - window.innerHeight, scroll down
		} else {
			checkPosVertical = bottom;
			scrollPosVertical = bottom;
			$("html, body").animate({scrollTop: scrollPosVertical});
		}
		//set bottom
		bottom = document.body.scrollHeight - scrollHeight;
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollLeft", function() { //function(params)
		checkPosHorizontal = scrollPosHorizontal - scrollWidth;
		//scrolling left will not reach the left end of the page -> scroll left
		if(checkPosHorizontal > 0) {
			scrollPosHorizontal -= scrollWidth;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		//Position of scrolling is on the left end of the page -> set control variables = 0, alert
		} else if(scrollPosHorizontal === 0){
			alert("scrolling left isn't possible");
			checkPosHorizontal = 0;
			scrollPosHorizontal = 0;
		//scrolling left reaches the left end of the page -> set control variables = 0, scroll left
		} else {
			checkPosHorizontal = 0;
			scrollPosHorizontal = 0;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollRight", function() { //function(params)
		checkPosHorizontal = scrollPosHorizontal + scrollWidth;
		//scrolling right will not reach the right end of the page -> scroll right
		if(checkPosHorizontal < rightEnd) {
			scrollPosHorizontal += scrollWidth;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		//Position of scrolling is on the right end of the page -> set control variables = document.body.scrollWidth, alert
		} else if(scrollPosHorizontal === rightEnd){
			alert("scrolling right isn't possible");
			checkPosHorizontal = rightEnd;
			scrollPosHorizontal = rightEnd;
		//scrolling right reaches the right end of the page -> set control variables = document.body.scrollWidth, scroll right
		} else {
			checkPosHorizontal = rightEnd;
			scrollPosHorizontal = rightEnd;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToRead", function() { //function(params)
		$("html, body").animate({ scrollTop: 100}, 30);
	})
);

