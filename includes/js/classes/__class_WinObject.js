class WinObject2{
    constructor(){
        /* constructor not required - put all this.vars = '' for reference */
        
        this.winObjectType = '';    // must be in constructor of extended class
        this.formPanel = '';        // must be in constructor of extended class
        this.displayPanel = '';     // must be in constructor of extended class
        
        this.primaryKey = '';
        this.blankrow = '';
        this.datarow = '';
        this.id = '';
        this.exists = '';
    }
    
    init(uniqueIdentifier=''){
        this.keys = win_info[this.winObjectType]['keys'];
        this.blankrow = win_info[this.winObjectType]['blankrow'];
        
        let tempId = tempIdString();
        this.defaultValues = {[this.keys['user']]:win_user['usr_id']};
        this.defaultValuesIfBlank = {[this.keys['primary']]:tempId, [this.keys['temp']]:tempId};
        
        this.datarow = typeof(uniqueIdentifier)=='object' ? uniqueIdentifier : {[this.keys['primary']]:uniqueIdentifier};
        this.refresh(uniqueIdentifier);
        
        return this;
    }
    
    refresh(){
        this.populateDatarow();
        this.id = this.datarow[this.keys['primary']];
        this.exists = window[`win_${this.winObjectType}s`][this.id] !== undefined;
        
        return this;
    }
    
    populateDatarow(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        datarow = typeof(datarow)=='object' ? datarow : this.blankrow;
        
        let newDatarow = {};
        let templateDatarow = this.exists ? window[`win_${this.winObjectType}Rows`][this.id] : this.blankrow;
        
        Object.keys(templateDatarow).forEach(key=>{
            newDatarow[key] = datarow[key]===undefined ? templateDatarow[key] : datarow[key];
        });
        
        this.datarow = newDatarow;
        return this.datarow;
    }
    
    renderFormPanel(){
        this.formPanel.render();
    }

    renderDisplayPanel(){
        this.displayPanel.render();
    }
    
    
    
    setFromDefaultValues(){
        Object.keys(this.defaultValues).forEach(key=>this.datarow[key] = this.defaultValues[key]);
        
        Object.keys(this.defaultValuesIfBlank).forEach(key=>{
            this.datarow[key] = this.datarow[key]=='' ? this.defaultValuesIfBlank[key] : this.datarow[key];
        });
    }
    
    getFromDatarow(datarow=''){
        let newDatarow = {};
        Object.keys(this.blankrow).forEach(key => newDatarow[key]=issetReturn(()=>datarow[key],''));
        return newDatarow;
    }
    
    setFromDatarow(datarow=''){
        this.datarow = this.getFromDatarow(datarow);
    }

    getFromForm(form){
        return this.getFromDatarow(getInputValuesAsObject(form));
    }
    
    setFromForm(form){
        this.datarow = this.getFromForm(form);
    }

    beforeAdd(){
        this.setFromDefaultValues();
    }
    
    afterAdd(){
        refreshWinVars();
    }
    
    add(){
        this.beforeAdd();
        mightyStorage.addObject(`${this.winObjectType}s`,this.datarow,this.keys['primary']);
        this.afterAdd()
    }
    
    
    addFormsInForm(){
        return '';
    }
    
    addFromForm(form){
        form = initElement(form);
        if(valid(form)){
            this.setFromForm(form);
            this.add();
            this.addFormsInForm(form.querySelectorAll('.form'),this.datarow);
            refreshWinVars();
            window[`all${ucFirst(this.winObjectType)}s`].loadPage();
        } else {
            getAllInputs(form).forEach((input)=>input.oninput());
        }
    }
    
    addFromAnyElementInForm(formChild){
        formChild = initElement(formChild);
        let form = getParentElementWithClass(formChild,'form');
        this.addFromForm(form,this.winObjectType);
    }
}


class WinObject{
    static getWinObjectType(){
        return 'winObjects';
    }
    
    static getObjects(){
        return window[`win_${this.getWinObjectType()}`]
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
    
    static addFormsInForm(){
        return '';
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
    
    static appendFormAboveButtonRow(buttonRowChild,objectDatarow=''){
        let buttonRow = buttonRowChild.classList.contains('buttonRow') 
            ? formChild 
            : getParentElementWithClass(buttonRowChild,'buttonRow');
        
        buttonRow.insertAdjacentHTML('beforeBegin',this.getLinkFormHtml(objectDatarow));
    }
    
    static getLinkFormHtml(objectDatarow=''){
        return `<div>${this.getFormPanelHtml(objectDatarow)}</div>`;
    }
}

