
//~ ************ Json Functions *************** //
function initJson(json){
	return (isJsonString(json) ? JSON.parse(json) : json);
}

function isJsonString(str) {
	try {JSON.parse(str);return true;} catch(e) {return false;}
}

function prettifyJson(json={}){
	json = isJsonString(json) ? JSON.parse(json) : json;
	return '<pre>' + JSON.stringify(json,null,4) + '</pre>';
}

