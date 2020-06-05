class PrjCusLinkDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'prj_cus_link';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
        
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}

