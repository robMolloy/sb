function convertHtmlStringToElements(htmlString){
    let div = document.createElement('template');
    div.insertAdjacentHTML('beforeend', htmlString);
    return div.children;
}

function convertHtmlStringToElement(htmlString){
    return convertHtmlStringToElements(htmlString)[0];
}

function convertElementToHtmlString(elm){
    let div = document.createElement('div');
    div.appendChild(elm);
    return div.innerHTML;
}
