class RecItemDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'rec_item';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}

