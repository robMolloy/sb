function wrapSelectElement(selectString,runChecks=false){
    return select(selectString,runChecks);
}

function select(selectString,runChecks=false){
    let select = createElementFromHtmlString(selectString);
    if(select.tagName!='SELECT'){console.error(select);console.error(`The select string passed does not create an input.`);}
    
    let selectPlaceholder = select.getAttribute('placeholder');
    let wrapperClasses = [...select.classList,...['selectWrapper','inputWrapper']];
    
    select.placeholder = '';
    select.extendAttribute('onchange',`defaultSelectWithWrapperFunction(this);`);
    select.extendAttribute('onfocus',`this.onchange();`);
    
    if(select.value!=''){wrapperClasses.push('inputFilled');}
    if(runChecks){wrapperClasses.push(checkInput(select) ? `inputValid` : `inputInvalid`);}
    
    return `
        <div class="${wrapperClasses.join(' ')}">
            ${getHtmlStringFromElement(select)}
            <div class="inputLabel">${selectPlaceholder}</div>
        </div>
    `;
}
