class Contact extends WinObject{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'contact';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new ContactFormPanel(this.datarow);
        this.displayPanel = new ContactDisplayPanel(this.datarow);; 
        this.refresh();
        return this;
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

