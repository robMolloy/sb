class formObject {
    constructor(formChild){
        this.constructorElement = formElement;
        this.form = formElement.classList.contains('form') ? formElement : getParentElementWithClass(formElement,'form');
        return this;
    }
    
    function changeInputWithNameToElementValue(name,element=''){
        element = element=='' ? this.constructorElement : element;
        let input = this.form.querySelector(`[name="${name}"]`);
        changeInputValue(input,value);
    }
    
    function enableInputWithName(name){
        
    }
    
    function elementValueIs(){
        
    }
}
