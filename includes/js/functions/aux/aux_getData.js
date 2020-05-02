function getElementValues(params={}){
	let f = issetReturn(() => params.f,new FormData);
	let getValuesFrom = initElement(issetReturn(()=>params.getValuesFrom));
	
	if(getValuesFrom!=='' && getValuesFrom!==undefined && getValuesFrom!==null){
		let all = getValuesFrom.querySelectorAll('input,select,textarea');
		let valid;
		for(let i=0; i<all.length; i++){
			valid = true;
			if(all[i].name==''){valid=false;}
			if(all[i].type=='checkbox' && all[i].checked==false){valid=false;}
			if(valid){f.append(all[i].name,all[i].value);}
		}
	}
	return f;
}

function getInputValuesAsObject(form){
	form = initElement(form);
    let object = {};
    let valid = true;
	
	if(form=='' || form==undefined || form==null){return object;}
	
    getAllInputs(form).forEach((input)=>{
        valid = true;
        if(input.name==''){valid=false;}
        if(input.type=='checkbox' && input.checked==false){valid=false;}
        if(valid){object[input.name] = getInputValue(input);}
    });
	return object;
}

function getJsonFromGetArray(){
	var getArray = getGetArray();
	var json = issetReturn(()=>getArray.json,{});
	return decodeURI(json);
}

function getCurrentFilename(){
	return window.location.href.split('/').pop().split('?')[0];
}

function getGetArray(){
	var getString = window.location.search.substring(1);
	var getArray = {};
	
	if(getString.length>0){
		var getPairs = getString.split('&');
		for(key in getPairs){getArray[getPairs[key].split('=')[0]] = getPairs[key].split('=')[1];}
	}
	
	return getArray;
}

function getInputValue(input){
    input = initElement(input);
    switch(input.tagName){
        case 'INPUT':
            if(input.type=='checkbox' && input.value==''){return input.checked;}
            return input.value;
        break;
        
        case 'SELECT':
            return input.value;
        break;
        
        case 'TEXTAREA':
            return input.innerHTML;
        break;
    }
}

function changeInputValue(input,value){
    input = initElement(input);
    switch(input.tagName){
        case 'INPUT':
            input.value = value;
        break;
        
        case 'SELECT':
            input.value = value;
        break;
        
        case 'TEXTAREA':
            input.innerHTML = value;
        break;
    }
}
