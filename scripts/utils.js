/**
 * import js file
 * string path
**/
function importJsFile(path) {
	var imported = document.createElement('script');
	imported.src = path;
	document.head.appendChild(imported);
}

