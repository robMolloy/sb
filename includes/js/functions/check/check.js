function isset(array){
	//~ TO USE: isset(() => arr1.json.datarow.wobble.blah) ? 'true' : 'false';
	try{return typeof array() !== 'undefined'}
	catch (e){return false;}
}

function issetReturn(array,value=''){
	//~ TO USE: issetReturn(() => arr1.json.datarow.wobble.blah,value);
	//~ CANNOT USE isset as a replacement for the next 3 lines of code - WHY??? WHO CARES!!!
	var istrue;
	try {istrue = typeof array() !== 'undefined';}
	catch (e){istrue = false;}
	
	return istrue ? array() : value;
}

function roughSizeOfObject(object) {
    var objectList = [];
    var stack = [ object ];
    var bytes = 0;
    while (stack.length) {
        var value = stack.pop();
        if (typeof(value) === 'boolean' ) {bytes += 4;}
        else if(typeof value === 'string' ) {bytes += value.length * 2;}
        else if(typeof value === 'number' ) {bytes += 8;}
        else if(typeof value === 'object' && objectList.indexOf( value ) === -1){
            objectList.push( value );
            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

function valid(elm){
    elm = initJson(elm);
    let valid = true;
    
    getAllInputs(elm).forEach(input=>{
        if(!checkInput(input)){valid = false;}
    });
    return valid;
}

function checkValue(check,value){
    let checkArray = check.split('_');
    switch(checkArray[0]){
        case '':
        return true;
        
        case 'maxChars':
        return value.length <= checkArray[1];
        
        case 'minChars':
        return value.length >= checkArray[1];
        
        case 'isNotBlank':
        return value!='';

        case 'isNumber':
        return value == parseFloat(value);

        case 'isInt':
            if(issetReturn(()=>checkArray[1],'')=='positive' && parseInt(value)<0){return false;}
            if(issetReturn(()=>checkArray[1],'')=='negative' && parseInt(value)>0){return false;}
        return value == parseInt(value);
        

        case 'isFloat':
        return value == parseFloat(value);
        
        case 'isPrice':
        return value == parseFloat(value);
    }
    console.error(`The function checkValue() does not have a test for ${check}`);
}

function checkInput(input){
    if(input.disabled){return true;}
    let checks = input.getAttribute('checks');
    checks = checks==null || checks.trim()=='' ? [] : input.getAttribute('checks').split(' ');
    return checks.every((check)=>checkValue(check,getInputValue(input)));
}

function getInvalidInputs(elm){
    elm = initElement(elm);
    let invalidInputs = [];

    getAllInputs(elm).forEach(input=>{
        if(!checkInput(input)){invalidInputs.push(input);}
    });
    return invalidInputs;
}

