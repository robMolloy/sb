class Record extends WinObject{
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
        return this;
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

