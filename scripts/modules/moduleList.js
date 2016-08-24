var moduleList = [
	"BrowserActionsModule.js",
	"WeatherModule.js",
	"zoomModule.js",
	"searchModule.js",
	"objectModule.js",
	"searchEngineModule.js"
	//"testModule.js"
	
	//add modules here
];


//Don't change something below
for (var i = 0; i < moduleList.length; i++) {
	importJsFile("scripts/modules/" + moduleList[i]);
}