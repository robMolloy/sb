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
    }
    
    getNewObject(datarow=''){
        return new Customer(datarow);
    }
}

