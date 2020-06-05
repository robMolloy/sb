class Records extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'record';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
        return this;
    }
    
    getNewObject(datarow=''){
        return new Record(datarow);
    }
}

