//~ *********** Ajax Functions ************* //
function ajax(params={}) {
	let file = issetReturn(()=>params.file); //~ !essential parameter!
	let f = issetReturn(() => params.f,new FormData);
	let nav = issetReturn(()=>params.nav); //~ !pass in file or essential parameter!
	
	if(nav!=''){f.append('nav',nav);}
	
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open("POST", file);
		request.onload = (()=>{
			if (request.status == 200){
				//~ ONLY TRUE IN DEV ////////////////////////////////////////////////////////////
				if(true){showInResponseLogContent(request.response);}
				resolve(request.response);
			} 
			else {reject(Error(request.statusText));}
		});
		request.onerror = (()=>{reject(Error("Network Error"));});
		request.send(f);
	});
}

async function ajaxTarget(params={}){
	let file = issetReturn(()=>params.file); //~ !essential parameter!
	let f = issetReturn(()=>params.f,new FormData);
	let getValuesFrom = issetReturn(()=>params.getValuesFrom); //~ getValuesFrom can pass idString or elm 
	
	f = getElementValues({'f':f,'getValuesFrom':getValuesFrom});
	let response = await ajax({'file':file,'f':f});
	return response;
}


