class Project2 extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        
        this.winObjectType = 'project';
        
        this.init(uniqueIdentifier);
        
        this.formPanel = new ProjectFormPanel(this.datarow);
        this.displayPanel = new ProjectDisplayPanel(this.datarow);; 
    }
}

