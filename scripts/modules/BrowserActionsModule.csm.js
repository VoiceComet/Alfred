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
		var scrollPosVertical = window.scrollY;
		//not on the top of the page
		if(scrollPosVertical != 0) {
			$("html, body").animate({scrollTop: 0}, 1000);
			//showMessage({content: "Scroll to the top"});
		//on top of the page
		} else {
			showMessage({title: "Attention!", content: "I cannot scroll to the top"});
			return({content: "I am at the top of the page. I cannot scroll to the top"});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToMiddle", function() { //function(params)
		var middle = Math.floor((document.body.scrollHeight - window.innerHeight) / 2);
		var scrollPosVertical = window.scrollY;
		//not in the middle of the page
		if(scrollPosVertical != middle) {
			//showMessage({content: "Scroll to the middle"});
			$("html, body").animate({scrollTop: middle}, 1000);
		//at the middle of the page
		} else {
			showMessage({title: "Attention!", content: "I cannot scroll to the middle"});
			return({content: "I am at the middle of the page. I cannot scroll to the middle"});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollToBottom", function() { //function(params)
		var scrollHeight = window.innerHeight * scrollHeightFactor;
		var bottom = document.body.scrollHeight - window.innerHeight;
		var scrollPosVertical = window.scrollY;
		//not on the bottom of the page
		if(scrollPosVertical < bottom) {
			//showMessage({content: "Scroll to the bottom"});
			$("html, body").animate({scrollTop: document.body.scrollHeight - scrollHeight}, 1000);
		//on the bottom of the page
		} else {
			showMessage({title: "Attention!", content: "I cannot scroll to the bottom"});
			return({content: "I am at the bottom of the page. I cannot scroll to the bottom"});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollUp", function() { //function(params)
		var scrollHeight = window.innerHeight * scrollHeightFactor;
		var scrollPosVertical = window.scrollY;
		//scrolling up will not reach the top of the page -> scroll up
		if(scrollPosVertical > 0) {
			//showMessage({content: "scroll up"});
			$("html, body").animate({scrollTop: scrollPosVertical - scrollHeight}, 1000);
		//Position of scrolling is on top of the page -> alert
		} else {
			showMessage({title: "Attention!", content: "I cannot scroll up"});
			return({content: "I reached the top of the page. I cannot scroll up"});
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
			//showMessage({content: "scroll down"});
			$("html, body").animate({scrollTop: scrollPosVertical + scrollHeight}, 1000);
		//Position of scrolling is on the bottom of the page -> alert
		} else {
			showMessage({title: "Attention!", content: "I cannot scroll down"});
			return({content: "I reached the bottom of the page. I cannot scroll down"});
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("scrollLeft", function() { //function(params)
		var scrollWidth = window.innerWidth * scrollWidthFactor;
		var scrollPosHorizontal = window.scrollX;
		//scrolling left will not reach the left end of the page -> scroll left
		if(scrollPosHorizontal > 0) {
			//showMessage({content: "scroll left"});
			$("html, body").animate({scrollLeft: scrollPosHorizontal - scrollWidth}, 1000);
		//Position of scrolling is on the left end of the page -> alert
		} else {
			showMessage({title: "Attention!", content: "I cannot scroll left"});
			return({content: "I reached the left border of the page. I cannot scroll left"});
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
			//showMessage({content: "scroll right"});
			$("html, body").animate({scrollLeft: scrollPosHorizontal + scrollWidth}, 1000);
		//Position of scrolling is on the right end of the page -> alert
		} else {
			showMessage({title: "Attention!", content: "I cannot scroll right"});
			return({content: "I reached the right border of the page. I cannot scroll right"});
		}
	})
);


