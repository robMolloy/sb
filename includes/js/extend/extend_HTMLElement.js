HTMLElement.prototype.getAttributeIfSet = function(attributeName){
    return this.getAttribute(attributeName)==null ? '' : this.getAttribute(attributeName);
}

HTMLElement.prototype.extendAttribute = function(attributeName,extendString){
    this.setAttribute(attributeName,`${this.getAttributeIfSet(attributeName)}${extendString}`)
}
