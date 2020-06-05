class WinObjects{
    
    constructor(){
        //~ this.winObjectType = '';
        //~ this.datarows = '';
        //~ this.objects = '';
        
        //~ this.init()
        //~ this.refresh()
        //~ this.getNewObject()
    }
    
    
    initWinObjects(){
        this.refreshWinObjects()
        return this;
    }
    
    
    refreshWinObjects(){
        //~ refreshes and sets this.datarows
        this.refreshDatarows();
        
        //~ using this.datarows - refreshes and sets this.objects
        this.refreshObjects();
        
    }
    
    
    refreshDatarows(){
        let dbObjects = window[`idb_${this.winObjectType}s`];
        let storedObjects = mightyStorage.get(`${this.winObjectType}s`,{});
        let deletedObjects = mightyStorage.get(`deleted_${this.winObjectType}s`,{});
        
        window[`win_${this.winObjectType}s`] = mergeTwoIndexedObjects(dbObjects,storedObjects);
        
        Object.values(deletedObjects).forEach((obj1)=>{
            delete window[`win_${this.winObjectType}s`][obj1[this.keys['primary']]];
            delete window[`win_${this.winObjectType}s`][obj1[this.keys['temp']]];
        });
        
        this.datarows = window[`win_${this.winObjectType}s`];
    }
    
    
    refreshObjects(){
        this.objects = {};
        Object.entries(this.datarows).forEach(entry =>{
            let key = entry[0];
            let datarow = entry[1];
            this.objects[key] = this.getNewObject(datarow);
        });
    }
    
    
    loadPage(){
        setTitle(ucFirst(this.winObjectType));
        displayHeaderBar(`${this.winObjectType}s`);
        clearMain();
        let tempObject = this.getNewObject();
        tempObject.renderFormPanel();
        Object.values(this.objects).forEach(object=>object.renderDisplayPanel());
    }
    
    
    getDatarowFromMixedDatarow(mixedDatarow){
        let newDatarow = {};
        Object.keys(win_info[this.getWinObjectType()]['blank']).forEach(key=>{
            newDatarow[key] = issetReturn(()=>mixedDatarow[key],'');
        });
        return winObject;
    }
    
    
    getSelect(selected='',attributesString=''){
        let allObjectRows = this.getObjects();
        let primaryKey = win_info[this.getWinObjectType()]['keys']['primary'];
        return `
            <select ${attributesString}>
                <option value="">None</option>
                ${Object.values(allObjectRows).map(objRow=>{
                    let optionAttributes = `value="${objRow[primaryKey]}"${objRow[this.keys['primary']]==selected ? ` selected="selected"` : ``}`;
                    return `<option ${optionAttributes}>${this.getSummaryLine(objRow)}</option>`;
                }).join('')}
            </select>
        `;
    }

}


    /*
    static getDefaultPanelHtml(winObject){
        let winObjectType = this.getWinObjectType();
        let labelRow = win_info[winObjectType]['labels'];
        return `
            <div class="panel singleColumn">
                ${Object.keys(winObject).map(key=>{
                    return `
                        <div>
                            <div style="flex:1">${labelRow[key]}</div>
                            <div style="flex:2">${winObject[key]}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    static getPanelHtml(winObject={}){
        return this.getDefaultPanelHtml(winObject);
    }
    
    static appendPanelInMain(winObject){
        appendToMain(this.getPanelHtml(winObject));
    }

    static displayPanelsInMain(){
        Object.values(this.getObjects()).reverse().forEach(winObject=>this.appendPanelInMain(winObject));
    }

    static getFormPanelHtml(){
        return this.defaultNewFormPanelHtml();
    }
    
    static displayFormPanelInMain(){
        appendNthInMain(0,this.getFormPanelHtml(winObject));
    }
    
    
    static defaultNewFormPanelHtml(){
        let winObjectType = this.getWinObjectType();
        let blankRow = win_info[winObjectType]['blank'];
        let labelRow = win_info[winObjectType]['labels'];
        return `<div class="panel form">
                    ${Object.keys(blankRow).map(key=>{
                        return `
                            ${input(`
                                <input 
                                    type="text" name="${key}" placeholder="${labelRow[key]}" value="${blankRow[key]}" 
                                    
                                >
                            `)}
                        `;
                    }).join('')}
                    <div class="jr"><span class="button" onclick="${winObjectType.slice(0,-1)}.addObjectFromAnyElementInForm(this);">Save ${winObjectType.slice(0,-1)}</span></div>
                </div>`;
    }
    
    static appendDefaultNewFormPanel(){
        appendToMain(this.defaultNewFormPanelHtml());
    }
    
    static indexOnPrimaryKey(winObject){
        let primaryKey = win_info[this.getWinObjectType()]['keys']['primary'];
        return convertObjectToObjectOfObjects(winObject,primaryKey);
    }
    
    */
    
    /*****   funcs for win_object ********/
    /*
    //~ returns only the key-value pairs and extends to include blank values not in mixedDatarow
    static getDatarowFromForm(form){
        form = initElement(form);
        let inputValues = getInputValuesAsObject(form);
        return this.getDatarowFromMixedDatarow(inputValues);
    }
    
    static getDefaultValues(){
        let defaultValues = {};
        let keys = win_info[this.getWinObjectType()]['keys'];
        defaultValues[`${keys['user']}`] = win_user['usr_id'];
        return defaultValues;
    }
    
    static getDefaultValuesIfBlank(){
        let defaultValues = {};
        let keys = win_info[this.getWinObjectType()]['keys'];
        
        let tempId = tempIdString();
        defaultValues[`${keys['primary']}`] = tempId;
        defaultValues[`${keys['temp_id']}`] = tempId;
        return defaultValues;
    }
    
    static setDefaultValues(winObject){
        let defaultValues = this.getDefaultValues();
        let defaultValuesIfBlank = this.getDefaultValuesIfBlank();
        Object.keys(defaultValues).forEach(key=>winObject[key] = defaultValues[key]);
        Object.keys(defaultValuesIfBlank).forEach(key=>{
            winObject[key] = winObject[key]=='' ? defaultValuesIfBlank[key] : winObject[key];
        });
        return winObject;
    }
    
    static addObject(winObject){
        winObject = this.setDefaultValues(winObject);
        
        let primaryKey = win_info[this.getWinObjectType()]['keys']['primary'];
        mightyStorage.addObject(`win_${this.getWinObjectType()}`,winObject,primaryKey);
    }
    
    static addFormsInForm(){
        return '';
    } only the key-value pairs and extends to include blank values not in mixedDatarow
    

    static getDatarowFromForm(form){
        form = initElement(form);
        let inputValues = getInputValuesAsObject(form);
        return this.getDatarowFromMixedDatarow(inputValues);
    }
    
    static getDefaultValues(){
        let defaultValues = {};
        let keys = win_info[this.getWinObjectType()]['keys'];
        defaultValues[`${keys['user']}`] = win_user['usr_id'];
        return defaultValues;
    }
    
    static getDefaultValuesIfBlank(){
        let defaultValues = {};
        let keys = win_info[this.getWinObjectType()]['keys'];
        
        let tempId = tempIdString();
        defaultValues[`${keys['primary']}`] = tempId;
        defaultValues[`${keys['temp_id']}`] = tempId;
        return defaultValues;
    }
    
    static addObjectFromForm(form){
        form = initElement(form);
        if(valid(form)){
            let object = this.getFromForm(form);
            this.addObject(object);
            this.addFormsInForm(form.querySelectorAll('.form'),object);
            refreshWinVars();
            this.loadPage();
        } else {
            getAllInputs(form).forEach((input)=>input.oninput());
        }
    }

    static addObjectFromAnyElementInForm(formChild){
        formChild = initElement(formChild);
        let form = getParentElementWithClass(formChild,'form');
        this.addObjectFromForm(form,this.getWinObjectType());
    }
    
    static getSummaryLine(winObject){
        return Object.values(winObject).join(', ');
    }
    
    static appendFormAboveButtonRow(buttonRowChild,objectDatarow=''){
        let buttonRow = buttonRowChild.classList.contains('buttonRow') 
            ? formChild 
            : getParentElementWithClass(buttonRowChild,'buttonRow');
        
        buttonRow.insertAdjacentHTML('beforeBegin',this.getLinkFormHtml(objectDatarow));
    }
    
    static getLinkFormHtml(objectDatarow=''){
        return `<div>${this.getFormPanelHtml(objectDatarow)}</div>`;
    }
    */
