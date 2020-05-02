function findParentWithClass(elm,class1){
    console.error('findParentWithClass() deprecated, change to getParentElementWithClass()');
    return getParentElementWithClass(elm,class1);
}

function findOriginalElementInForm(elm){
    console.error('findOriginalElementInForm() deprecated, change to getOriginalElementInForm()');
    return getOriginalElementInForm(elm);
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
