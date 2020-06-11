class PrjCusLink extends WinObject{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'prj_cus_link';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new PrjCusLinkFormPanel(this.datarow);
        this.displayPanel = new PrjCusLinkDisplayPanel(this.datarow);; 
        this.refresh();
        return this;
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

