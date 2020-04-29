function getParentElementWithClass(elm,class1){
    let parent = elm.parentElement;
    if(parent.classList.contains(class1)){
        return parent;
    } else {
        return getParentElementWithClass(parent,class1);
    }
}

function getOriginalElementInForm(elm){
    if(elm.name.slice(-5)!='_copy'){console.error(`Element passed in getOriginalElementInForm() must have a name ending in "_copy"`);}
    let parent = getParentElementWithClass(elm,'form');
    return parent.querySelector(`[name=${elm.name.slice(0,-5)}]`);
}


function getAllInputs(elm){
    elm = initElement(elm)
    return Array.from(elm.querySelectorAll('input,select,textarea'));
}

function getAllElementsInParentWithClassUsingQuerySelector(elmChild,class1,qsString){
    let parent = getParentElementWithClass(elmChild,class1);
    return parent.querySelectorAll(qsString);
}
