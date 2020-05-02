function removeClassOnElements(class1,elements){
    elements = isElement(elements) ? [elements] : elements;
    elements.forEach(element=>element.classList.remove(class1));
}

function addClassOnElements(class1,elements){
    elements = isElement(elements) ? [elements] : elements;
    elements.forEach(element=>element.classList.add(class1));
}

function toggleClassOnNextElement(elm,class1){
    elm.nextElementSibling.classList.toggle(class1);
}

function toggleClassOnElementsInsideElement(class1,qsString,parentElement){
    parentElement.querySelectorAll(qsString).forEach(elm=>elm.classList.toggle(class1));
}

function toggleClassOnElementsInsideElementAndFocusChildIfClassRemoved(class1,qsString,parentElement){
    parentElement.querySelectorAll(qsString).forEach(elm=>{
        if(elm.classList.contains(class1)){
            elm.classList.remove(class1);
            getAllInputs(elm).forEach(input=>{input.focus();input.disabled="";});
        }
        else{
            elm.classList.add(class1);
            getAllInputs(elm).forEach(input=>{input.disabled="disabled";});
        }
    });
}
