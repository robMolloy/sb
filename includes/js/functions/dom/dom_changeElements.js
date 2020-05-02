function changeAllElementsInParentWithClassUsingQuerySelectorToValue(elmChild,class1,qsString,value){
    let elms = getAllElementsInParentWithClassUsingQuerySelector(elmChild,class1,qsString);
    elms.forEach((elm)=>{changeElmValue(elm,value)});
}

function changeElmValue(elm,value){
    elm = initElement(elm);
    if(['SELECT','INPUT','OPTION','BUTTON'].indexOf(elm.tagName)>-1){elm.value=value;}
    else{elm.innerHTML = value;}
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
