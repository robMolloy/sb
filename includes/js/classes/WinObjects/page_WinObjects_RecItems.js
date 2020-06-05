class RecItems extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'rec_item';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
    }
    
    getNewObject(datarow=''){
        return new RecItem(datarow);
    }
}

