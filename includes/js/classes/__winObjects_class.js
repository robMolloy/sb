
class winObject{
    static getWinObjectType(){
        return 'winObjects';
    }
    
    static getObjects(){
        return window[`win_${this.getWinObjectType()}`]
    }
    
    static addFormsInForm(){
        return '';
    }
    
    static initObjects(){
        let objectType = this.getWinObjectType();
        let keys = win_info[objectType][`keys`];
        let dbObjects = window[`win_db_${objectType}`];
        let storedObjects = mightyStorage.get(`win_${objectType}`,{});
        let deletedObjects = mightyStorage.get(`win_delete_${objectType}`,{});
        window[`win_${objectType}`] = mergeTwoIndexedObjects(dbObjects,storedObjects);
        Object.values(deletedObjects).forEach((obj1)=>{
            delete window[`win_${objectType}`][obj1[keys['primary']]];
            delete window[`win_${objectType}`][obj1[keys['temp']]];
        });
    }
    
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
    
    static loadPage(){
        setTitle(ucFirst(this.getWinObjectType()));
        displayHeaderBar(this.getWinObjectType());
        clearMain();
        this.displayFormPanelInMain();
        this.displayPanelsInMain();
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
    
    static getFromObject(object){
        let winObject = {};
        Object.keys(win_info[this.getWinObjectType()]['blank']).forEach(key=>{
            winObject[key] = issetReturn(()=>object[key],'');
        });
        return winObject;
    }

    static getFromForm(form){
        form = initElement(form);
        let inputValues = getInputValuesAsObject(form);
        return this.getFromObject(inputValues);
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
    
    static getSelect(selected='',attributesString=''){
        let allObjectRows = this.getObjects();
        let primaryKey = win_info[this.getWinObjectType()]['keys']['primary'];
        return `
            <select ${attributesString}>
                <option value="">None</option>
                ${Object.values(allObjectRows).map(objRow=>{
                    let optionAttributes = `value="${objRow[primaryKey]}"${objRow[primaryKey]==selected ? ` selected="selected"` : ``}`;
                    return `<option ${optionAttributes}>${this.getSummaryLine(objRow)}</option>`;
                }).join('')}
            </select>
        `;
    }
}

