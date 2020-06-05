class RecItemDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'rec_item';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    
    static getSummaryLine(datarow=''){
        console.log(datarow);
        
        datarow = datarow=='' ? this.datarow : datarow;
        
        console.log(datarow);
        return `
            ${datarow.rci_work}: 
            ${datarow.rci_qty}
            ${datarow.rci_unit} x 
            ${price(datarow.rci_cost_per_unit)} = 
            ${price(datarow.rci_total)}
        `;
    }
}

