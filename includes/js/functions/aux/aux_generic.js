//~ ********** Generic functions - used on all pages ************* //
function initFormData(f=''){
	return f=='' ? new FormData: f;
}

function initElement(element=''){
    if(isElement(element)){return element;}
    if(isElementId(element)){return document.getElementById(element);}
    console.error(`Is not an element`)
}

function online(){
    if(dev){console.error('online() is not set up to check if online [ping google? better to ping server but could be slower]');}
    return true;
}

function getHrefContactPrefix(method){
    return {sms:'sms:',email:'mailto:',whatsapp:'whatsapp://send?phone='}[method];
}

function getHrefContactTextWord(method){
    return {sms:'?body=',email:'?body=',whatsapp:'&text='}[method];
}

function getHrefContactText(text){
    return encodeURI(text);
}

function getHrefContactString(method,address,text=''){
    return getHrefContactPrefix(method) + address + getHrefContactTextWord(method) + getHrefContactText(text);
}

function getUrl(){
    return window.location.href;
}

function getPage(){
    
    return getUrl().split('/').slice(-1)[0];
}
