
/** @type {String|Null} */
var addressMessageId = null;
/** @type {Number} */
var activeAddress = 0;
/** @type {{String match, String readable, String[] parts, Number markCount}[]} */
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
	//cut all after div ChromeSpeechControlDIV
	bodyHtml = bodyHtml.replace(/(<div id="ChromeSpeechControlDIV"[\s\S]*)/g, "");

	/** @type RegExp */
	var searched = /\b[\w\döÖüÜäÄß. -]{3,51}(?:\s|\n|\r|\t|&nbsp;|<br.*?>)+[\d]{1,4}(?:\s|\n|\r|\t|&nbsp;|<br.*?>)*(?:[a-zA-Z])?(?:\s|\n|\r|\t|&nbsp;|<br.*?>)+(?:[0][1-9]|[1-9][0-9])[0-9]{3}(?:\s|\n|\r|\t|&nbsp;|<br.*?>)+[\w\döÖüÜäÄß -]{3,21}/g;


	while ((result = searched.exec(bodyHtml)) != null) {
		var parts = result[0].replace(/(?:\s|\n|\r|\t|&nbsp;)+/g, " ").split(/<.*?>/g);
		addresses.push({result:result[0], readable:result[0].replace(/(?:\s|\n|\r|\t|&nbsp;|<br.*?>)+/g, " "), parts:parts, markCount:0});
	}
}

/**
 * highlight all addresses and fill the marks array
 */
function highlightAllAddresses() {
	var beginningMarkCount = jQuery.makeArray(document.getElementsByClassName("highlight")).length;
	for (var i = 0; i < addresses.length; i++) {
		//mark all parts of address
		for (var j = 0; j < addresses[i].parts.length; j++) {
			$("body").mark(addresses[i].parts[j], {
				className: "highlight",
				separateWordSearch: false,
				acrossElements: true,
				accuracy: {
					"value": "exactly",
					"limiters": ["&nbsp;"]
				},
				exclude: [
					"script",
					"style",
					"noscript",
					"#ChromeSpeechControlDIV *"
				],
				filter: function(node, term, totalCounter, counter){
					//only mark the first result
					return (counter <= 0);
				}
			});
		}
		//get mark count for this address
		marks = jQuery.makeArray(document.getElementsByClassName("highlight"));
		addresses[i].markCount = marks.length - beginningMarkCount;
		beginningMarkCount = marks.length;
	}
}

/**
 * get id of first mark entry of active address
 * @return {Number}
 */
function getFirstActiveMarkId() {
	//count address parts
	var activeMarkBeginning = 0;
	for (var i = 0; i < activeAddress; i++) {
		activeMarkBeginning += addresses[i].markCount;
	}
	return activeMarkBeginning;
}

/**
 * highlight active address in given color
 * @param color
 */
function highlightActiveAddress(color) {
	var activeMarkBeginning = getFirstActiveMarkId();
	for (var j = 0; j < addresses[activeAddress].markCount; j++) {
		marks[activeMarkBeginning + j].style.backgroundColor = color;
	}
}

/**
 * highlight active address yellow
 */
function highlightActiveAddressNormal() {
	highlightActiveAddress("yellow")
}

/**
 * highlight active address orange
 */
function highlightActiveAddressHighlight() {
	highlightActiveAddress("rgb(255, 150, 50)")
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
			showOrUpdateAddressMessage();
			highlightActiveAddressHighlight();
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
		return {address:addresses[activeAddress].readable};
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
		return {address:addresses[activeAddress].readable};
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

/**
 * go to certain address
 */
addContentScriptMethod(
	new ContentScriptMethod("showAddressOnMap", function () {
		handleRequest({callFunction:"openMap", params:{}}, null, null);
		document.addEventListener("initializedAlfredMap", function() {
			handleRequest({callFunction:"mapSearch", params:{query:addresses[activeAddress].readable}}, null, null);
		});
	})
);