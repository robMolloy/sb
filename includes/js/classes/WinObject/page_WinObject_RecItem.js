class RecItem extends WinObject{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'rec_item';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new RecItemFormPanel(this.datarow);
        this.displayPanel = new RecItemDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

