function changeTargetElements(sourceElement,qsStringOrElms,changeValueFunction='',limitSearchToParentElementClass=''){
    let value = getInputValue(sourceElement)
    let parentElement = parentElementClass=='' ? document.body : getParentElementWithClass(parentElementClass);
    let targetElements = parentElement.querySelectorAll(qsString);
    let newValue = changeValueFunction=='' ? value : changeValueFunction(value);
    changeElmValues(target,newValue);
}

function changeDateTimeInputsOnForm(sourceElement){
    let value = getInputValue(sourceElement);
    let isTimestamp = checkValue('isTimestamp',value);
    let timestampInputName = isTimestamp ? sourceElement.name : sourceElement.name.split('_').slice(0,-1).join('_');
    
    let form = sourceElement.parentWithClass('form');
    let dateInput = form.querySelector(`name=${timestampInputName}_date`);
    let timeInput = form.querySelector(`name=${timestampInputName}_time`);
    let timestampInput = form.querySelector(`name=${timestampInputName}`);
    
    if(isTimestamp){
        let dt = new Date(parseInt(value));
        dateInput.value = dt.getMyDate();
        timeInput.value = dt.getMyTime();
    } else {
        let dt = new Date(`${dateInput.value} ${timeInput.value}`);
        timestampInput = dt.getTime();
    }
}






function changeAllElementsInParentWithClassUsingQuerySelectorToValue(elmChild,class1,qsString,value){
    let elms = getAllElementsInParentWithClassUsingQuerySelector(elmChild,class1,qsString);
    elms.forEach((elm)=>{changeElmValue(elm,value)});
}

function changeElmValue(elm,value){
    if(['SELECT','INPUT','OPTION','BUTTON'].indexOf(elm.tagName)>-1){elm.value=value;}
    else{elm.innerHTML = value;}
}

function changeElmValues(elms,value){
    elms = Array.isArray(elms) ? elms : [elms]
    elms.forEach(elm=>changeElmValue(elm,value));
}


function changeValueOfInputWithNameOnParentWithClassToThisValue(name,class1,elmChild){
    let form = getParentElementWithClass(elmChild,'form')
    form.querySelector(`input[name="${name}"]`).value = elmChild.value;
}

function copyValueToInputWithSameNameNoSuffixOnParentWithClass(elmChild,class1){
    name = elmChild.name.split('_').slice(0,-1).join('_');
    let parent = getParentElementWithClass(elmChild,class1);
    parent.querySelector(`input[name="${name}"]`).value = elmChild.value;
}

function defaultCopyValueToInput(elm){
    copyValueToInputWithSameNameNoSuffixOnParentWithClass(elm,'panel');
}

function convertInputElementToSelectElement(input,options=[],blankOption=`None`){
    //~ does not replace element in DOM
    let inputString = getHtmlStringFromElement(input);
    let selectString = `
        ${inputString.replace('input','select')}
            ${blankOption===false ? `` : `<option value="">${blankOption}</option>`}
            ${options.map(opt=>`<option value="${opt}"${input.value==opt ? `selected="selected"` : ``}>${opt}</option>`).join('')}
        </select>
    `;
    
    let select = createElementFromHtmlString(selectString);
    return select;
}

function ifElementIsNotValueDisableInputWithNameOnForm(elm,value,name){
    let form = getParentElementWithClass(elm,'form');
    let input = form.querySelector(`[name="${name}"]`)
    let inputWrapper = getParentElementWithClass(input,'inputWrapper');
    if(getInputValue(elm)!=value){
        input.disabled = 'disabled';
        inputWrapper.classList.add('disabled')
    } else {
        input.disabled = '';
        inputWrapper.classList.remove('disabled')
    }
}


