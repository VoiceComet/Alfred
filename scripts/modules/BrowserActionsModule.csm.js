var scrollPosVertical = 0;
var scrollPosHorizontal = 0;
var checkPosVertical = 0;
var checkPosHorizontal = 0;

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
		if(scrollPosVertical != 0) {
			$("html, body").animate({scrollTop: 0});
			scrollPosVertical = 0;
		} else {
			alert("This is the top of the page");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToBottom", function() { //function(params)
		if(scrollPosVertical != document.body.scrollHeight) {
			$("html, body").animate({scrollTop: document.body.scrollHeight});
			scrollPosVertical = document.body.scrollHeight - window.innerHeight;
		} else {
			alert("This is the bottom of the page");
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollUp", function() { //function(params)
		checkPosVertical = scrollPosVertical - window.innerHeight;
		if(checkPosVertical > 0) {
			scrollPosVertical -= window.innerHeight;
			$("html, body").animate({scrollTop: scrollPosVertical});
		} else if(scrollPosVertical === 0){
			alert("scrolling up isn't possible");
			checkPosVertical = 0;
			scrollPosVertical = 0;
		} else {
			checkPosVertical = 0;
			scrollPosVertical = 0;
			$("html, body").animate({scrollTop: scrollPosVertical});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollDown", function() { //function(params)
		checkPosVertical = scrollPosVertical + window.innerHeight;
		if(checkPosVertical < document.body.scrollHeight) {
			scrollPosVertical += window.innerHeight;
			$("html, body").animate({scrollTop: scrollPosVertical});
		} else if(scrollPosVertical === document.body.scrollHeight){
			alert("scrolling down isn't possible");
			checkPosVertical = document.body.scrollHeight - window.innerHeight;
			scrollPosVertical = document.body.scrollHeight - window.innerHeight;
		} else {
			checkPosVertical = document.body.scrollHeight - window.innerHeight;
			scrollPosVertical = document.body.scrollHeight - window.innerHeight;
			$("html, body").animate({scrollTop: scrollPosVertical});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollLeft", function() { //function(params)
		checkPosHorizontal = scrollPosHorizontal - window.innerWidth;
		if(checkPosHorizontal > 0) {
			scrollPosHorizontal -= window.innerWidth;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		} else if(scrollPosHorizontal === 0){
			alert("scrolling left isn't possible");
			checkPosHorizontal = 0;
			scrollPosHorizontal = 0;
		} else {
			checkPosHorizontal = 0;
			scrollPosHorizontal = 0;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollRight", function() { //function(params)
		checkPosHorizontal = scrollPosHorizontal + window.innerWidth;
		if(checkPosHorizontal < document.body.scrollWidth) {
			scrollPosHorizontal += window.innerWidth;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		} else if(scrollPosHorizontal === document.body.scrollWidth){
			alert("scrolling right isn't possible");
			checkPosHorizontal = document.body.scrollWidth;
			scrollPosHorizontal = document.body.scrollWidth;
		} else {
			checkPosHorizontal = document.body.scrollWidth;
			scrollPosHorizontal = document.body.scrollWidth;
			$("html, body").animate({scrollLeft: scrollPosHorizontal});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToRead", function() { //function(params)
		$("html, body").animate({ scrollTop: 100}, 30);
	})
);

