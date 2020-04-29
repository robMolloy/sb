function findParentWithClass(elm,class1){
    console.error('findParentWithClass() deprecated, change to getParentElementWithClass()');
    return getParentElementWithClass(elm,class1);
    /*
    let parent = elm.parentElement;
    if(parent.classList.contains(class1)){
        return parent;
    } else {
        return findParentWithClass(parent,class1);
    }
    */
}

function findOriginalElementInForm(elm){
    console.error('findOriginalElementInForm() deprecated, change to getOriginalElementInForm()');
    return getOriginalElementInForm(elm);
    /*
    if(elm.name.slice(-5)!='_copy'){console.error(`Element passed in findOriginalElementInForm() must have a name ending in "_copy"`);}
    let parent = findParentWithClass(elm,'form');
    return parent.querySelector(`[name=${elm.name.slice(0,-5)}]`);
    */
}


function focusNextInputOnForm(formChild){
    let form = getParentElementWithClass(formChild,'form');
    let allElmsInForm = form.querySelectorAll('*');
    let indexOfFormChild = allElmsInForm.indexOf(formChild);
    
    let elmsAfterFormChild = allElmsInForm.slice(-5);
    elmsAfterFormChild.forEach((elm)=>{
        if(elm.tagName=='INPUT' || elm.tagName=='SELECT' || elm.tagName=='TEXTAREA'){
            elm.focus();
        }
    })
}
