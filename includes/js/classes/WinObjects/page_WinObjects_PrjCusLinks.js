class PrjCusLinks extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'prj_cus_link';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
        return this;
    }
    
    getNewObject(datarow=''){
        return new PrjCusLink(datarow);
    }
}

