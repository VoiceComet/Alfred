
/** @type {String|Null} */
var addressMessageId = null;
/** @type {Number} */
var activeAddress = 0;
/** @type {{String match, String readable, String[] parts}[], } */
var addresses = [];
/** @type {Object[]}*/
var marks = [];

/**
 * reset address finder
 */
function resetAddressFinder() {
	if (addressMessageId !== null) {
		hideMessage({id:addressMessageId});
		addressMessageId = null;
	}
	activeAddress = 0;
	addresses = [];
	$("body").unmark();
	marks = [];
}

/**
 * search addresses on website and fill addresses array
 */
function searchAddresses() {
	var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(document.documentElement.innerHTML)[1];

	/** @type RegExp */
	var searched = /\b[\w\döÖüÜäÄß. -]{3,51}(?:\s|\n|\r|\t|<br.*?>)+[\d]{1,4}(?:\s|\n|\r|\t|<br.*?>)*(?:[a-zA-Z])?(?:\s|\n|\r|\t|<br.*?>)+(?:[0][1-9]|[1-9][0-9])[0-9]{3}(?:\s|\n|\r|\t|<br.*?>)+[\w\döÖüÜäÄß -]{3,21}/g;

	while ((result = searched.exec(bodyHtml)) != null) {
		var parts = result[0].split(/<.*?>/g);
		addresses.push({result:result[0], readable:result[0].replace(/(?:\s\s|\n|\r|\t|<br.*?>)/g, " "), parts:parts});
	}
}

/**
 * highlight all addresses and fill the marks array
 */
function highlightAllAddresses() {
	for (var i = 0; i < addresses.length; i++) {
		for (var j = 0; j < addresses[i].parts.length; j++) {
			$("body").mark(addresses[i].parts[j], {
				className: "highlight",
				separateWordSearch: false,
				accuracy: "exactly",
				exclude: [
					"script",
					"style",
					"noscript",
					"#ChromeSpeechControlDIV *"
				]
			});
		}
	}
	marks = jQuery.makeArray(document.getElementsByClassName("highlight"));
}

/**
 * get id of first mark entry of active address
 * @return {Number}
 */
function getFirstActiveMarkId() {
	//count address parts
	var activeMarkBeginning = 0;
	for (var i = 0; i < activeAddress; i++) {
		activeMarkBeginning += addresses[i].parts.length;
	}
	return activeMarkBeginning;
}

/**
 * highlight active address in given color
 * @param color
 */
function highlightAddress(color) {
	var activeMarkBeginning = getFirstActiveMarkId();
	for (var j = 0; j < addresses[activeAddress].parts.length; j++) {
		marks[activeMarkBeginning + j].style.backgroundColor = color;
	}
}

/**
 * highlight active address yellow
 */
function highlightActiveAddressNormal() {
	highlightAddress("yellow")
}

/**
 * highlight active address orange
 */
function highlightActiveAddressHighlight() {
	highlightAddress("rgb(255, 150, 50)")
}

/**
 * scroll to active address
 */
function scrollToActiveAddress() {
	var activeMarkBeginning = getFirstActiveMarkId();
	$('html, body')
		.animate({
			scrollTop: $(marks[activeMarkBeginning]).offset().top - window.innerHeight / 2,
			scrollLeft: $(marks[activeMarkBeginning]).offset().left - window.innerWidth / 2
		}, 1000);
}

/**
 * show or update the address message box
 */
function showOrUpdateAddressMessage() {
	var params = {
		content: addresses[activeAddress].readable,
		time: 0,
		cancelable: true,
		commandLeft: "previous",
		commandRight: "next",
		infoCenter: "match " + (activeAddress + 1) + " of " + addresses.length
	};

	if (addressMessageId === null) {
		addressMessageId = showMessage(params);
	} else {
		params.id = addressMessageId;
		//noinspection JSCheckFunctionSignatures
		updateMessage(params);
	}
}

addContentScriptMethod(
	new ContentScriptMethod("showAddressResults", function() {
		resetAddressFinder();
		searchAddresses();

		if(addresses.length === 0) {
			//no addresses found
			showMessage({content: "Could not find addresses", centered: true});
			return({content: "I could not find addresses", followingState:"globalCommonState"});
		} else {
			//addresses found
			highlightAllAddresses();
			highlightActiveAddressHighlight();
			showOrUpdateAddressMessage();
			scrollToActiveAddress();
		}
	})
);

addContentScriptMethod(
	new ContentScriptMethod("cancelAddressState", function() {
		resetAddressFinder();
	})
);

/**
 * show next address
 */
addContentScriptMethod(
	new ContentScriptMethod("nextAddress", function() {
		//addresses found
		highlightActiveAddressNormal();
		activeAddress = (activeAddress + 1) % addresses.length;
		highlightActiveAddressHighlight();
		showOrUpdateAddressMessage();
		scrollToActiveAddress();
	})
);

/**
 * show previous address
 */
addContentScriptMethod(
	new ContentScriptMethod("previousAddress", function() {
		//addresses found
		highlightActiveAddressNormal();
		activeAddress = (activeAddress - 1 < 0) ? addresses.length-1 : activeAddress - 1;
		highlightActiveAddressHighlight();
		showOrUpdateAddressMessage();
		scrollToActiveAddress();
	})
);

/**
 * go to certain address
 */
addContentScriptMethod(
	new ContentScriptMethod("certainAddress", function (params) {
		if (params > 0 && params <= addresses.length) {
			highlightActiveAddressNormal();
			activeAddress = params - 1;
			highlightActiveAddressHighlight();
			showOrUpdateAddressMessage();
			scrollToActiveAddress();
		} else {
			showMessage({content: "There is no address " + params , centered: true});
			return({content: "I cannot find a address " + params});
		}
	})
);