function isJson(str){
    try {JSON.parse(str);}
    catch(e) {return false;}
    return true;
}

function isObject(object){
    if(!object instanceof Array){return false;}
    if(typeof(object)=='object'){return true;}
}

function isObjectOfObjects(objectOfObjects){
    if(!isObject(objectOfObjects)){return false;}
    return Object.values(objectOfObjects).every(object=>isObject(object));
}

function isArray(array){
    return array instanceof Array;
}

function isArrayOfObjects(arrayOfObjects){
    if(!isArray(arrayOfObjects)){return false;}
    return arrayOfObjects.every(object=>isObject(object));
}

function isElement(element){
    if(element==null){return false;}
    return element.nodeName!=undefined;
}

function isElementId(elementId){
    return document.getElementById(elementId)==null;
}

function isEditableElement(element){
    if(!isElement(element)){return false;}
    return element.tagName=='INPUT' || element.tagName=='TEXTAREA' ||element.tagName=='SELECT';
}
