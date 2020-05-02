HTMLElement.prototype.getAttributeIfSet = function(attributeName){
    return this.getAttribute(attributeName)==null ? '' : this.getAttribute(attributeName);
}

HTMLElement.prototype.extendAttribute = function(attributeName,beforeString='',afterString=''){
    this.setAttribute(attributeName,`${beforeString} ${this.getAttributeIfSet(attributeName)} ${afterString}`)
}
