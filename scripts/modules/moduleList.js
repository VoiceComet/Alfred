var moduleList = [
	"browserActionsModule.js",
	"weatherModule.js",
	"zoomModule.js",
	"searchModule.js",
	"videoModule.js",
	"searchEngineModule.js",
	"mapModule.js",
	"bookmarkModule.js",
	"linkModule.js",
	"imageModule.js"
	//"testModule.js"
	
	//add modules here
];


//Don't change something below
for (var i = 0; i < moduleList.length; i++) {
	importJsFile("scripts/modules/" + moduleList[i]);
}