class Projects extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'project';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
    }
    
    getNewObject(datarow=''){
        return new Project(datarow);
    }
    
    acronymExists(acronym){
        let acronyms = Object.keys(indexAnObjectOfObjects(win_projects,'prj_acronym'));
        return acronyms.some(acr=>acr.toLowerCase()==acronym.toLowerCase());
    }
    
    ifInputValueIsSameAsProjectAcronymAddError(input){
        if(this.acronymExists(input.value)){input.parentElement.classList.add('inputError');}
    }
    
    aboveButtonRowFormHtml(){
        return prj_cus_link.getLinkToProjectFormHtml();
    }

}

