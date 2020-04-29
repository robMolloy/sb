function inputSelect(inputString,options,blankOption=`None`,runChecks=false){
    let originalInput = createElementFromHtmlString(inputString);
    if(originalInput.tagName!='INPUT'){console.error(originalInput);console.error(`The input string passed does not create an input.`);}
    originalInput.extendAttribute('oninput',`defaultCopyValueToInput(this);`)
    
    let input = copyElm(originalInput);
    input.name = `${originalInput.name}_input`;
    input.disabled = 'disabled';
    input.classList.add('hidden');
    
    let select = convertInputElementToSelectElement(originalInput,options,blankOption);
    select.name = `${originalInput.name}_select`;
    
    let hiddenInput = copyElm(originalInput);
    hiddenInput.type = 'hidden';
    
    return `
        <div class="flexGap inputSelectWrapper">
            <span class="button lhSquare" onclick="defaultToggleInputSelectBehaviour(this);">
                <i class="fas fa-pencil-alt hidden"></i><i class="far fa-hand-point-up"></i>
            </span>
            ${wrapInputElement(getHtmlStringFromElement(input))}
            ${wrapSelectElement(getHtmlStringFromElement(select))}
            ${getHtmlStringFromElement(hiddenInput)}
        </div>
    `;
}


function defaultToggleInputSelectBehaviour(element){
    let inputSelectWrapper = element.classList.contains('inputSelectWrapper') 
        ? element : getParentElementWithClass(element,'inputSelectWrapper');
    toggleClassOnElementsInsideElementAndFocusChildIfClassRemoved('hidden',`i,.inputWrapper`,inputSelectWrapper)
}

