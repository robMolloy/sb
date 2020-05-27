class FormPanel extends Panel{
    constructor(){
        super();
    }
    
    initFormPanel(datarow=''){
        this.idPrefix = 'FormPanel';
        this.defaultPosition = 0;

        this.initPanel(datarow);
        return this;
    }
}
