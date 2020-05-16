
//~ ************ Response Log Functions *************** //
function createResponseLog(){
	if(!document.getElementById('responseLog')){
		let rlog = '<div id="responseLog" class="hidden"></div>';
		document.querySelector('#content').insertAdjacentHTML('afterbegin',`
            <div id="responseLog" class="hidden">
                <div id="responseLogButtons">
                    <button onclick="window.scrollTo(0,1)">
                        Scroll
                    </button>
                </div>
                <div id="responseLogContent"></div>
            </div>
        `);
	}
}

function showInResponseLogContent(json){
    createResponseLog();
	document.getElementById('responseLogContent').innerHTML = prettifyJson(json);
}

function toggleResponseLog(){
	if(!document.getElementById('responseLog')){createResponseLog();}
	document.getElementById('responseLog').classList.toggle("hidden");
}


