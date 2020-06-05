class Contact extends WinObject2{
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
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

