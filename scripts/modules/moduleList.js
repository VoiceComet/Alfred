var moduleList = [
	"tabHandleModule.js",
	"scrollModule.js",
	"weatherModule.js",
	"zoomModule.js",
	"searchModule.js",
	"videoModule.js",
	"searchEngineModule.js",
	"mapModule.js",
	"bookmarkModule.js",
	"linkModule.js",
	"imageModule.js",
	"addressModule.js",
	"ownCommandModule.js"
	//"testModule.js"
	
	//add modules here
	//please add per new module a new entry in options
];


//Don't change something below
for (var i = 0; i < moduleList.length; i++) {
	importJsFile("scripts/modules/" + moduleList[i]);
}