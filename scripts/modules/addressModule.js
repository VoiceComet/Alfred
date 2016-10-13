/**
 * Module for interacting with addresses on web pages
 */

addModule(new Module("addressModule", function () {

	/**
	 * search for addresses
	 * @type {Action}
	 */
	var addressSearch = new Action("search expression", 0, globalCommonState);
	addressSearch.addCommands([
		new Command("addresses", 0)
	]);
	addressSearch.act = function () {
		callContentScriptMethod("showAddressResults", {});
	};
	this.addAction(addressSearch);

}));