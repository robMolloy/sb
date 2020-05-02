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
    
    if(input.value!=''){wrapperClasses.push('inputFilled');}
    if(runChecks){wrapperClasses.push(checkInput(input) ? `inputValid` : `inputInvalid`);}
    
    return `
        <div class="${wrapperClasses.join(' ')}">
            ${getHtmlStringFromElement(input)}
            <div class="inputLabel">${inputPlaceholder}</div>
        </div>
    `;
}

function inputWrapperUpdate(input){
    let parent = getParentElementWithClass(input,'inputWrapper')
    if(input.value==''){parent.classList.remove('inputFilled');}else{parent.classList.add('inputFilled');}
    changeClassesOnInputWrapperIfValid(input,checkInput(input));
}

function changeClassesOnInputWrapperIfValid(input,valid){
    if(valid){
        input.parentElement.classList.remove('inputError');
        input.parentElement.classList.add('inputValid');
    }else{
        input.parentElement.classList.add('inputError');
        input.parentElement.classList.remove('inputValid');
    }

}

