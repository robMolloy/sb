class Customers extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'customer';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
        return this;
    }
    
    getNewObject(datarow=''){
        return new Customer(datarow);
    }
}

