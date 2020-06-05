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
    }
    
    getNewObject(datarow=''){
        return new Contact(datarow);
    }
}

