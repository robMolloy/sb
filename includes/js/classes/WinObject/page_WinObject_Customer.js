class Customer extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'customer';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new CustomerFormPanel(this.datarow);
        this.displayPanel = new CustomerDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

