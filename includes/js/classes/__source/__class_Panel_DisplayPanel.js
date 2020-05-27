class DisplayPanel extends Panel{
    constructor(){
        super();
    }
    
    initDisplayPanel(datarow=''){
        this.idPrefix = 'DisplayPanel';
        this.defaultPosition = 'last';

        this.initPanel(datarow);
        return this;
    }
    
}

