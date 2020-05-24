function createElementFromHtmlString(htmlString){
    return createElementsFromHtmlString(htmlString)[0];
}

function createElementsFromHtmlString(htmlString){
    if(devVerbose){console.error('createElementFromHtmlString() & createElementsFromHtmlString() deprecated - use convertHtmlStringToElement()');}
    
    let div = document.createElement('template');
    div.insertAdjacentHTML('beforeend', htmlString);
    return div.children;
    //~ return document.createElement('template').insertAdjacentHTML('beforeend', htmlString).children;
}

function getHtmlStringFromElement(elm){
    if(devVerbose){console.error('getHtmlStringFromElement() deprecated - use convertElementToHtmlString()');}
    
    let div = document.createElement('div');
    div.appendChild(elm);
    return div.innerHTML;
}

function copyElm(elm){
    return createElementFromHtmlString(getHtmlStringFromElement(elm));
}
