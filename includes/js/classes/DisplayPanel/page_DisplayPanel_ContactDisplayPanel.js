class ContactDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'contact';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}

