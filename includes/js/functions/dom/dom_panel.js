function findParentPanel(elm){
    return getParentElementWithClass(elm,'panel');
}

function copyValueToCopyElmsInPanel(elm){
    let value = elm.value;
    let panel = findParentPanel(elm);
    
    panel.querySelectorAll(`*[name='copy_${elm.getAttribute("name")}']`).forEach(elm2=>elm2.innerHTML=`${value}`);
}
