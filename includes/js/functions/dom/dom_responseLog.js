
//~ ************ Response Log Functions *************** //
function createResponseLog(){
	if(!document.getElementById('responseLog')){
		let rlog = '<div id="responseLog" class="hidden"></div>';
		document.querySelector('body').insertAdjacentHTML('afterbegin','<div id="responseLog" class="hidden"></div>');
	}
}

function showInResponseLog(json){
    createResponseLog();
	document.getElementById('responseLog').innerHTML = prettifyJson(json);
}

function toggleResponseLog(){
	if(!document.getElementById('responseLog')){createResponseLog();}
	document.getElementById('responseLog').classList.toggle("hidden");
}


