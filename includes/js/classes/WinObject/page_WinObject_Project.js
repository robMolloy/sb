class Project2 extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'project';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new ProjectFormPanel(this.datarow);
        this.displayPanel = new ProjectDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}

