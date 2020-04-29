function wrapInputElement(inputString,runChecks=false){
    return input(inputString,runChecks);
}

function input(inputString,runChecks=false){
    let input = createElementFromHtmlString(inputString);
    if(input.tagName!='INPUT'){console.error(input);console.error(`The input string passed does not create an input.`);}
    
    let inputPlaceholder = input.getAttribute('placeholder');
    let wrapperClasses = [...input.classList, ...['inputWrapper']];
    input.placeholder = '';
    input.classList = [];
    
    input.extendAttribute('oninput',`defaultInputWithWrapperFunction(this);`);
    input.extendAttribute('onfocus',`this.oninput();`);
    input.extendAttribute('onfocusout',`this.oninput();`);
    
    if(input.value!=''){wrapperClasses.push('inputFilled');}
    if(runChecks){wrapperClasses.push(checkInput(input) ? `inputValid` : `inputInvalid`);}
    
    return `
        <div class="${wrapperClasses.join(' ')}">
            ${getHtmlStringFromElement(input)}
            <div class="inputLabel">${inputPlaceholder}</div>
        </div>
    `;
}

function inputWrapperUpdate(elm){
    let parent = getParentElementWithClass(elm,'inputWrapper')
    
    if(elm.value==''){parent.classList.remove('inputFilled');}else{parent.classList.add('inputFilled');}
    if(checkInput(elm)){
        parent.classList.remove('inputError');
        parent.classList.add('inputValid');
    }else{
        parent.classList.add('inputError');
        parent.classList.remove('inputValid');
    }
}

