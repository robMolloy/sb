class Contacts extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'contact';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
        return this;
    }
    
    getNewObject(datarow=''){
        return new Contact(datarow);
    }
}

