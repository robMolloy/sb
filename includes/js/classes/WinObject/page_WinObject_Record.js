class Record extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'record';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new RecordFormPanel(this.datarow);
        this.displayPanel = new RecordDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

