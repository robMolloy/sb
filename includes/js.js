Date.prototype.getMyDate = function(){return `
    ${this.getFullYear()}-${(this.getMonth()+1).toString().padStart(2,`0`)}-${this.getDate().toString().padStart(2,`0`)}
`.trim();}

Date.prototype.getMyTime = function(){return `
    ${this.getHours().toString().padStart(2,`0`)}:${this.getMinutes().toString().padStart(2,`0`)}
`.trim();}

HTMLElement.prototype.getAttributeIfSet = function(attributeName){
    return this.getAttribute(attributeName)==null ? '' : this.getAttribute(attributeName);
}

HTMLElement.prototype.extendAttribute = function(attributeName,beforeString='',afterString=''){
    this.setAttribute(attributeName,`${beforeString} ${this.getAttributeIfSet(attributeName)} ${afterString}`)
}

HTMLElement.prototype.parentWithClass = function(classString){
    let parent = this.parentElement;
    if(parent.classList.contains(classString)){
        return parent;
    } else {
        return parent.parentWithClass(classString);
    }
}

String.prototype.toDate = function(){return new Date(this.valueOf());}

String.prototype.toggleSuffix = function(suffix){
    if(this.slice(-suffix.length)==suffix){return this.slice(0,-suffix.length);} else {return `${this}${suffix}`;}
}


class Panel{
    initPanel(datarow=''){
        this.datarow = datarow;
        
        this.inforow = win_info[this.winObjectType];
        
        /* should not need these - assume datarow is correct ??? */
        /*
        this.datarow = datarow=='' ? this.datarow : datarow;
        this.datarow = this.datarow ? this.datarow : this.inforow['blankrow'];
        */ 
        /* should not need these - assume datarow is correct ??? */

        
        this.labelrow = this.inforow['labelrow'];
        this.blankrow = this.inforow['blankrow'];
        this.keys = this.inforow['keys'];
        
        this.objectId = this.datarow[this.keys['primary']];
        this.id = this.objectId=='' ? this.idPrefix : `${this.idPrefix}_${this.objectId}`;
        //~ this.create();
        
        return this;
    }
    
    update(){
        this.element.innerHTML = this.getHtml();
    }
    
    toggleVisiblity(){
        let hidden = this.element.classList.toggle('hidden');
        this.visible = !hidden;
        return this.visible;
    }
    
    show(){
        this.element.classList.remove('hidden');
    }
    
    hide(){
        this.element.classList.add('hidden');
    }
    
    create(){
        if(!this.element){
            this.element = convertHtmlStringToElement(`<div id="${this.id}" class="panel ${this.defaultClasses.join(' ')}"></div>`);
            this.update();
        }
    }
    
    render(position=''){
        this.create();
        position = position=='' ? this.defaultPosition : position;
        appendNthInMain(position,this.element);
        
        this.show();
        this.visible = true;
    }
    
    getHtml(){}
}

class DisplayPanel extends Panel{
    constructor(){
        super();
    }
    
    initDisplayPanel(datarow=''){
        this.idPrefix = 'DisplayPanel';
        this.defaultPosition = 'last';

        this.initPanel(datarow);
        return this;
    }
    
    getHtml(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        let labelrow = this.labelrow;
        
        return `
            <div class="panel singleColumn">
                ${Object.keys(datarow).map(key=>{
                    return `
                        <div>
                            <div style="flex:1">${labelrow[key]}</div>
                            <div style="flex:2">${datarow[key]}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}


class FormPanel extends Panel{
    constructor(){
        super();
    }
    
    initFormPanel(datarow=''){
        this.idPrefix = 'FormPanel';
        this.defaultPosition = 0;

        this.initPanel(datarow);
        return this;
    }
}

class WinObject2{
    
    constructor(){
        //~ this.winObjectType = '';
        //~ this.formPanel = '';    
        //~ this.displayPanel = ''; 
        
        //~ this.init()
        //~ this.refresh()
    }
    
    initWinObject(uniqueIdentifier=''){
        this.keys = win_info[this.winObjectType]['keys'];
        this.blankrow = win_info[this.winObjectType]['blankrow'];
        
        let tempId = tempIdString();
        this.defaultValues = {[this.keys['user']]:win_user['usr_id']};
        this.defaultValuesIfBlank = {[this.keys['primary']]:tempId, [this.keys['temp']]:tempId};
        
        this.datarow = typeof(uniqueIdentifier)=='object' ? uniqueIdentifier : {[this.keys['primary']]:uniqueIdentifier};
        this.refreshWinObject();
        
        return this;
    }
    
    refreshWinObject(){
        this.id = this.datarow[this.keys['primary']];
        this.exists = window[`win_${this.winObjectType}s`][this.id] !== undefined;
        this.populateDatarow();
        
        return this;
    }
    
    populateDatarow(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        datarow = typeof(datarow)=='object' ? datarow : this.blankrow;
        
        let newDatarow = {};
        let templateDatarow = this.exists ? window[`win_${this.winObjectType}s`][this.id] : this.blankrow;
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
    }
    
    afterAdd(){
    }
    
    add(){
        this.beforeAdd();
        this.setFromDefaultValues();
        mightyStorage.addObject(`${this.winObjectType}s`,this.datarow,this.keys['primary']);
        refreshWinVars();
        //~ window[`all${ucFirst(this.winObjectType)}`]
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
            //~ deal with refresh in the add? 
            //~ window[`all${formatStringForLabel(this.winObjectType)}s`].refresh().loadPage();
            window[`all${formatStringForLabel(this.winObjectType)}s`].refresh().loadPage();
        } else {
            getAllInputs(form).forEach((input)=>input.oninput());
        }
    }
    
    addUsingFormChild(formChild){
        let form = getParentElementWithClass(formChild,'form');
        this.addFromForm(form,this.winObjectType);
    }
}

/*
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
        let dbObjects = window[`idb_${objectType}`];
        let storedObjects = mightyStorage.get(`${objectType}s`,{});
        let deletedObjects = mightyStorage.get(`deleted_${objectType}`,{});
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
    
    
    static displayFormPanelInMain(winObject){
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

*/

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

class Contacts extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'contact';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
    }
    
    getNewObject(datarow=''){
        return new Contact(datarow);
    }
}


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
    }
    
    getNewObject(datarow=''){
        return new PrjCusLink(datarow);
    }
}


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


class RecItems extends WinObjects{
    constructor(){
        super()
        this.init();
    }
    
    init(){
        this.winObjectType = 'rec_item';
        this.initWinObjects();
    }
    
    refresh(){
        this.refreshWinObjects();
    }
    
    getNewObject(datarow=''){
        return new RecItem(datarow);
    }
}


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
    }
    
    getNewObject(datarow=''){
        return new Record(datarow);
    }
}


/*
class contact extends WinObject{
    static getWinObjectType(){
        return 'contacts';
    }
    
    static getFormPanelHtml(contact){
        let labelRow = win_info['contacts']['labels'];
        return `
            <div class="panel form">
                ${wrapSelectElement(`
                    ${customer.getSelect('',`placeholder="${labelRow.con_cus_id}" name="con_cus_id" checks="isNotBlank"`)}
                `)}
                <div class="flexl1r2 flexGap">
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>contact.con_type,'phone')}"
                            onchange="ifElementIsNotValueDisableInputWithNameOnForm(this,'phone','con_method');"
                            placeholder="${labelRow.con_type}" name="con_type" checks="isNotBlank" 
                        >
                            ${win_contact_types.map(type=>`<option value="${type}">${ucFirst(type)}</option>`).join('')}
                        </select>`
                    )}
                    ${input(`<input 
                        type="text" value="${issetReturn(()=>contact.con_address,'')}" 
                        placeholder="${labelRow.con_address}" name="con_address"  
                    >`)}
                </div>
                ${wrapSelectElement(
                    `<select 
                        type="text" placeholder="${labelRow.con_method}" name="con_method" checks="isNotBlank" 
                        value="${issetReturn(()=>contact.con_method,'')}" 
                        ${issetReturn(()=>contact.con_type,'phone')!='phone' ? `disabled="disabled"` : ``}
                    >
                        ${win_contact_method.map(type=>`<option value="${type}">${ucFirst(type)}</option>`).join('')}
                    </select>`
                )}
                <div class="jr"><button onclick="contact.addObjectFromAnyElementInForm(this);">Save contact</button></div>
            </div>
        `;
    }
    
    static getLinkFormHtml(){
        let labelRow = win_info['contacts']['labels'];
        return `
            <div class="form">
                <div class="flexGap">
                    <div class="closeButton" onclick="removeParentElementWithClass(this,'form');">&#8855;</div>
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>contact.con_type,'phone')}"
                            onchange="ifElementIsNotValueDisableInputWithNameOnForm(this,'phone','con_method');"
                            placeholder="${labelRow.con_type}" name="con_type" checks="isNotBlank" class="width3Lh"
                        >
                            ${win_contact_types.map(type=>`<option value="${type}">${ucFirst(type)}</option>`).join('')}
                        </select>`
                    )}
                    ${input(`<input 
                        type="text" value="${issetReturn(()=>contact.con_address,'')}" 
                        placeholder="${labelRow.con_address}" name="con_address" checks="isNotBlank"
                    >`)}
                </div>
                ${wrapSelectElement(
                    `<select 
                        type="text" placeholder="${labelRow.con_method}" name="con_method" checks="isNotBlank" 
                        value="${issetReturn(()=>contact.con_method,'')}" 
                        ${issetReturn(()=>contact.con_type,'phone')!='phone' ? `disabled="disabled"` : ``}
                    >
                        ${win_contact_method.map(type=>`<option value="${type}">${ucFirst(type)}</option>`).join('')}
                    </select>`
                )}
            </div>
        </div>`;
    }
}

*/

/*
class customer extends WinObject{
    static getWinObjectType(){
        return 'customers';
    }
    
    static getPanelHtml(customer){
        let contactsOnCustomer = issetReturn(()=>win_contactsGroupedByCus_id[customer.cus_id],{});
        return `
            <div class="panel singleColumn">
                <div class="fw600 jc">${customer.cus_first_name} ${customer.cus_last_name}</div>
                ${Object.values(contactsOnCustomer).map((contact)=>{
                    let primaryContact = customer.cus_primary_con_id==contact.con_id;
                    return `
                        <a class="flexl1r2 flexGap lh" href="${getHrefContactString(contact.con_method,contact.con_address,'hello world')}">
                            <div class="nowrap">${contact.con_type} [${contact.con_method}]</div>
                            <div class="jr flexGap">
                                <div class="jr">${contact.con_address}</div>
                                <span class="jc lightAccentBorder border mediumSquare borderRadius">
                                    <span class="${primaryContact ? `accentText` : `transparent`}">&#9673;</span>
                                </span>
                            </div>
                        </a>
                    `;
                }).join('')}
                <button><span>Add New Method Of Contact +</span></button>
            </div>
        `;
    }
    
    static getFormPanelHtml(customer){
        let labelRow = win_info['customers']['labels'];
        
        return `
            <div class="panel form">
                ${input(`<input 
                    type="text" value="${issetReturn(()=>customer.cus_first_name,'')}" 
                    placeholder="${labelRow.cus_first_name}" name="cus_first_name" checks="isNotBlank" 
                >`)}
                ${input(`<input 
                    type="text" value="${issetReturn(()=>customer.cus_last_name,'')}" 
                    placeholder="${labelRow.cus_last_name}" name="cus_last_name" checks="isNotBlank" 
                >`)}
                <div class="buttonRow">
                    <button onclick="contact.appendFormAboveButtonRow(this)"><span class="flexGap"><span>+</span><div class="">Add Contact</div></span></button>
                    <div class="flex1"></div>
                    <button onclick="customer.addObjectFromAnyElementInForm(this);"><span>Save Customer</span></button>
                </div>
            </div>
        `;
    }
    
    static getDefaultValues(){
        return {'cus_usr_id':win_user['usr_id']};
    }
    
    static getDefaultValuesIfBlank(){
        let tempId = tempIdString();
        return {'cus_id':tempId,'cus_temp_id':tempId};
    }
    
    static getSummaryLine(customer){
        return `${customer.cus_first_name} ${customer.cus_last_name}`;
    }
    
    static addFormsInForm(forms,addedObject=''){
        let datarowArray = Array.from(forms).map((form)=>{
            let datarow = contact.getFromForm(form);
            datarow['con_cus_id'] = issetReturn(()=>addedObject['cus_id'],'');
            return datarow;
        });
        datarowArray.forEach(datarow=>contact.addObject(datarow));
    }
}







*/

/*
class prj_cus_link extends WinObject{
    static getWinObjectType(){
        return 'prj_cus_links';
    }
    
    static getFormPanelHtml(prj_cus_link){
        let labelRow = win_info['prj_cus_links']['labels'];
        return `
            <div class="panel form">
                ${wrapSelectElement(`
                    ${project.getSelect('',`placeholder="${labelRow.prj_cus_link_prj_id}" name="prj_cus_link_prj_id" checks="isNotBlank"`)}
                `)}
                ${wrapSelectElement(`
                    ${customer.getSelect('',`placeholder="${labelRow.prj_cus_link_cus_id}" name="prj_cus_link_cus_id" checks="isNotBlank"`)}
                `)}
                <div class="jr"><button onclick="prj_cus_link.addObjectFromAnyElementInForm(this);">Save prj_cus_link</button></div>
            </div>
        `;
    }
    
    static getLinkFormHtml(){
        let labelRow = win_info['prj_cus_links']['labels'];
        return `
            <div class="form">
                ${wrapSelectElement(`
                    ${customer.getSelect('',`placeholder="${labelRow.prj_cus_link_cus_id}" name="prj_cus_link_cus_id" checks="isNotBlank"`)}
                `)}
            </div>
        `;
    }
}


*/

/*
class project extends WinObject{
    
    static getWinObjectType(){
        return 'projects';
    }
    
    static addFormsInForm(forms,addedObject=''){
        let datarowArray = Array.from(forms).map((form)=>{
            let datarow = prj_cus_link.getFromForm(form);
            datarow['prj_cus_link_prj_id'] = issetReturn(()=>addedObject['prj_id'],'');
            return datarow;
        });
        let datarowObject = indexAnArrayOfObjects(datarowArray,'prj_cus_link_cus_id');
        Object.values(datarowObject).forEach(datarow=>prj_cus_link.addObject(datarow));
    }
    
    static getPanelHtml(project){
        let customersOnProject = issetReturn(()=>win_customersGroupedByPrj_id[project.prj_id],{});
        let recordsOnProject = issetReturn(()=>win_recordsGroupedByPrj_id[project.prj_id],{});
        
        let primaryCustomer = issetReturn(()=>win_customers[project.prj_primary_cus_id],{});
        let primaryContact = issetReturn(()=>win_contacts[primaryCustomer.cus_primary_con_id],{});
        
        return `
            <div class="panel singleColumn">
                <div class="fw600">
                    <div class="">${this.getSummaryLine(project)}</div>
                    <div class="flex1 jr">${price(project.prj_rate_per_default_unit)}/${project.prj_default_unit}</div>
                </div>
                <span>
                    <span>
                        ${project.prj_default_qty} ${project.prj_default_unit}s
                        every
                        ${project.prj_default_repeat_every_qty} ${project.prj_default_repeat_every_unit}s
                    </span>
                </span>
                ${Object.values(customersOnProject).map(customer=>`
                    <div class="grid12 ${primaryCustomer.cus_id==customer.cus_id ? `lightBg` : ``}">
                        <span class="gs4 borderRight">${customer.cus_first_name} ${customer.cus_last_name}</span>
                        <div class="gs8 singleColumn">
                            ${Object.values(issetReturn(()=>win_contactsGroupedByCus_id[customer.cus_id],{})).map(contact=>`
                                <a class="jc" href="${getHrefContactString(contact.con_method,contact.con_address,'hello world')}">
                                    ${customer.cus_primary_con_id == contact.con_id ? `<span class="accentText">&#9673;</span>` : ``}
                                    ${contact.con_address} 
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <span onclick="toggleClassOnNextElement(this,'hidden');" class="click">
                    <div>Records (${Object.keys(recordsOnProject).length} on project) &#9660;</div>
                </span>
                <div class="singleColumn hidden flex1">
                    <span><button><span>Add Record</span></button></span>
                    ${Object.values(recordsOnProject).map(record=>`
                        <div class="grid12">
                            <div class="gs4 borderRight">${formatTimestampToDate(record.rec_timestamp_planned_start)}</div>
                            <div class="gs8">${record.rec_description}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="jr"><button><span class="icon"><i class="fas fa-pencil-ruler"></i></span></button></div>
            </div>
        `;
    }
    
    static winAcronymExists(acronym){
        let acronyms = Object.keys(indexAnObjectOfObjects(win_projects,'prj_acronym'));
        return acronyms.some(acr=>acr.toLowerCase()==acronym.toLowerCase());
    }
    
    static ifInputValueIsSameAsProjectAcronymAddError(input){
        if(this.winAcronymExists(input.value)){input.parentElement.classList.add('inputError');}
    }
    
    static getFormPanelHtml(project){
        let labelRow = win_info['projects']['labels'];
        
        return `
            <div class="panel form">
                <div>Pick a unique reference for this project</div>
                ${wrapInputElement(`<input 
                    type="text" value="${issetReturn(()=>project.prj_acronym,'')}" name="prj_acronym" 
                    checks="isNotBlank minChars_3" placeholder="${labelRow.prj_acronym}" 
                    oninput="project.ifInputValueIsSameAsProjectAcronymAddError(this);"
                >`)}
                <div>What is the address of this project?</div>
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>project.prj_address_1,'')}" 
                    name="prj_address_1" placeholder="${labelRow.prj_address_1}" checks="isNotBlank" 
                >`)}
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>project.prj_address_2,'')}" 
                    name="prj_address_2" placeholder="${labelRow.prj_address_2}" 
                >`)}
                <div class="flexGap flexl2r1">
                    ${wrapInputElement(`<input type="text" value="${issetReturn(()=>project.prj_city,'')}" 
                        name="prj_city" placeholder="${labelRow.prj_city}" checks="isNotBlank" 
                    >`)}
                    ${wrapInputElement(`<input type="text" value="${issetReturn(()=>project.prj_postcode,'')}" 
                        name="prj_postcode" placeholder="${labelRow.prj_postcode}" checks="isNotBlank" 
                    >`)}
                </div>
                <div>What work is usually done on this project?</div>
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>project.prj_default_work,'')}"
                        placeholder="${labelRow.prj_default_work}" name="prj_default_work" checks="isNotBlank" 
                    >`
                    ,win_work
                )}
                <div>What is the default unit of work?</div>
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>project.prj_default_unit,'')}"
                        placeholder="${labelRow.prj_default_unit}" name="prj_default_unit" checks="isNotBlank" 
                    >`
                    ,win_units
                )}
                <div>How many units of work will usually take place?</div>
                <div class="flexGap">
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>project.prj_default_qty,'')}" 
                        name="prj_default_qty" placeholder="${labelRow.prj_default_qty}" checks="isFloat" 
                    >`)}
                    <div class="formLabel">Units</div>
                </div>
                <div>What is the rate charged per unit of work?</div>
                <div class="flexGap">
                    <span class="width2Lh jc borderBottom borderTop padSmall">£</span>
                    ${wrapInputElement(`<input type="text" value="${issetReturn(()=>project.prj_rate_per_default_unit,'')}" 
                        name="prj_rate_per_default_unit" placeholder="${labelRow.prj_rate_per_default_unit}" 
                        checks="isFloat"
                    >`)}
                    <div class="borderTop borderBottom padSmall jc nowrap width2Lh">Per Unit</div>
                </div>
                <div>How often will the work take place?</div>
                <div class="flexGap">
                    <div class="padSmall borderTop borderBottom width2Lh jc">Every</div>
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>project.prj_default_repeat_every_qty,'1')}" 
                        name="prj_default_repeat_every_qty" placeholder="${labelRow.prj_default_repeat_every_qty}" 
                        checks="isInt_positive" class="width2Lh"
                    >`)}
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>project.prj_default_repeat_every_unit,'')}"
                            placeholder="${labelRow.prj_default_repeat_every_unit}" name="prj_default_repeat_every_unit" checks="isNotBlank" 
                        >
                            ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                        </select>`
                    )}
                </div>
                <div class="singleColumn gridGap0">
                    <div>What is the usual duration of this work?</div>
                    <div class="fs70 jr">(May be the same as the default unit and quantity              )</div>
                </div>
                <div class="flexGap">
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>project.prj_default_duration_qty,'1')}" 
                        name="prj_default_duration_qty" placeholder="${labelRow.prj_default_duration_qty}" 
                        checks="isInt_positive" class="width2Lh"
                    >`)}
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>project.prj_default_duration_unit,'hour')}"
                            placeholder="${labelRow.prj_default_duration_unit}" name="prj_default_duration_unit" 
                            checks="isNotBlank" 
                        >
                            ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                        </select>`
                    )}
                </div>
                <div class="singleColumn gridGap0">
                    <div>What is the rate charged per unit of time worked?</div>
                    <div class="fs70 jr">(Leave as 0 if not paid per unit of time)</div>
                </div>
                <div class="flexGap">                                                     
                    <span class="width2Lh jc borderBottom borderTop padSmall">£</span>
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>project.prj_default_cost_per_duration_unit,'0.00')}" 
                        name="prj_default_cost_per_duration_unit" placeholder="${labelRow.prj_default_cost_per_duration_unit}" 
                        checks="isInt_positive"
                    >`)}
                    <div class="borderTop borderBottom padSmall jc nowrap width2Lh">Per Unit</div>
                </div>
                <div class="buttonRow">
                    <button onclick="prj_cus_link.appendFormAboveButtonRow(this);"><span class="flexGap"><span>+</span><div>Add Customer</div></span></button>
                    <span class="flex1"></span>
                    <button onclick="project.addObjectFromAnyElementInForm(this);">Save Project</button>
                </div>
            </div>
        `;
    }
    
    static getDefaultValues(){
        return {'prj_usr_id':win_user['usr_id']};
    }
    
    static getDefaultValuesIfBlank(){
        let tempId = tempIdString();
        return {'prj_id':tempId,'prj_temp_id':tempId};
    }

    static getSummaryLine(project){
        return `${project.prj_acronym}: ${[project.prj_address_1,project.prj_city].filter((entry)=>entry.trim()!='').join(',  ')}`;
    }
    
    static aboveButtonRowFormHtml(){
        return prj_cus_link.getLinkToProjectFormHtml();
    }
}
*/

/*
class rec_item extends WinObject{
    static getWinObjectType(){
        return 'rec_items';
    }
    
    static getFormPanelHtml(rec_item){
        let labelRow = win_info['rec_items']['labels'];
        //~ {rci_id:'Id',rci_temp_id:'Id',rec_usr_id:'User Id',rci_rec_id:'Record Id',rci_work:'Type Of Work',
        //~ rci_unit:'Unit',rci_qty:'Quantity',rci_cost_per_unit:'Cost per Unit'}
        return `
            <div class="panel form">
                ${select(`
                    <select placeholder="${labelRow.rci_rec_id}" name="rci_rec_id" checks="isNotBlank" >
                        <option value="">None</option>
                        ${Object.values(win_records).map((rec)=>{
                            let prjRow = win_projects[rec.rec_prj_id];
                            return `
                                <option value="${rec.rec_id}" ${rec.rec_id==issetReturn(()=>rec_item.rci_rec_id,'') ? `selected="selected"` : ``}>
                                    ${prjRow.prj_acronym}: ${formatTimestampToDate(rec.rec_timestamp_planned_start)}: ${rec.rec_description}
                                </option>
                            `;
                        }).join('')}
                    </select>
                `)}
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>rec_item.rci_work,'')}"
                        placeholder="${labelRow.rci_work}" name="rci_work" checks="isNotBlank" 
                    >`
                    ,
                    Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_work'))
                )}
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>rec_item.rci_unit,'')}"
                        placeholder="${labelRow.rci_unit}" name="rci_unit" checks="isNotBlank" 
                    >`
                    ,
                    Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_unit'))
                )}
                <div class="flexGap">
                    <span class="lhSquare jc borderBottom borderTop">£</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_cost_per_unit,'0.00')}" class="flex1"
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_cost_per_unit}" name="rci_cost_per_unit" checks="isNotBlank" 
                    >`)}
                    <span class="lhSquare jc borderBottom borderTop padSmall">x</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_qty,'1')}" class="flex1" 
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_qty}" name="rci_qty" checks="isNotBlank" 
                    >`)}
                </div>
                <div>
                    <span class="borderBottom borderTop lh padSmall flexGap">
                        <span class="lightText">Total</span>
                        <span class="lightText">|</span>
                        <span class="jr" name="rci_price">
                            <input class="tar width3Lh" type="text" name="rci_total" value="${price('')}" readonly>
                        </span>
                    </span>
                    <span class="flex1"></span>
                    <button onclick="rec_item.addObjectFromAnyElementInForm(this);">Save rec_item</button>
                </div>
            </div>
        `;
    }
    
    static getLinkFormHtml(rec_item){
        console.log(rec_item);
        let labelRow = win_info['rec_items']['labels'];
        return `
            <div class="form">
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>rec_item.rci_work,'')}"
                        placeholder="${labelRow.rci_work}" name="rci_work" checks="isNotBlank" 
                    >`
                    ,
                    win_work
                )}
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>rec_item.rci_unit,'')}"
                        placeholder="${labelRow.rci_unit}" name="rci_unit" checks="isNotBlank" 
                    >`
                    ,
                    win_units
                )}
                <div class="flexGap">
                    <span class="lhSquare jc borderBottom borderTop padSmall">£</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_cost_per_unit,'0.00')}" class="flex1"
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_cost_per_unit}" name="rci_cost_per_unit" checks="isNotBlank" 
                    >`)}
                    <span class="lhSquare jc borderBottom borderTop padSmall">x</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_qty,'1')}" class="flex1" 
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_qty}" name="rci_qty" checks="isNotBlank" 
                    >`)}
                </div>
                <div>
                    <span class="borderBottom borderTop lh padSmall flexGap">
                        <span class="lightText">Total</span>
                        <span class="lightText">|</span>
                        <span class="jr" name="rci_price">
                            <input class="tar width3Lh" type="text" name="rci_total" value="${price(issetReturn(()=>rec_item.rci_total,'0.00'))}" readonly>
                        </span>
                    </span>
                </div>
            </div>
        `;
    }

    static getSummaryLine(recItemRow){
        return `${recItemRow.rci_work}: ${recItemRow.rci_qty}${recItemRow.rci_unit} x ${price(recItemRow.rci_cost_per_unit)} = ${price(recItemRow.rci_total)}`;
    }
    
    static getRecItemDefaultDatarowFromProjectId(projectId){
        let projectDatarow = win_projects[projectId];
        let recItemDatarow = win_info['rec_items']['blank'];
        
        recItemDatarow['rci_work'] = projectDatarow['prj_default_work'];
        recItemDatarow['rci_qty'] = projectDatarow['prj_default_qty'];
        recItemDatarow['rci_unit'] = projectDatarow['prj_default_unit'];
        recItemDatarow['rci_cost_per_unit'] = projectDatarow['prj_rate_per_default_unit'];
        recItemDatarow['rci_total'] = recItemDatarow['rci_qty'] * recItemDatarow['rci_cost_per_unit'];
        
        return recItemDatarow;
    }
    
    static getRecItemDurationDatarowFromProjectId(projectId){
        let projectDatarow = win_projects[projectId];
        let recItemDatarow = win_info['rec_items']['blank'];
        console.log(projectDatarow);
        
        recItemDatarow['rci_work'] = projectDatarow['prj_default_work'];
        recItemDatarow['rci_qty'] = projectDatarow['prj_default_duration_qty'];
        recItemDatarow['rci_unit'] = projectDatarow['prj_default_duration_unit'];
        recItemDatarow['rci_cost_per_unit'] = projectDatarow['prj_default_cost_per_duration_unit'];
        recItemDatarow['rci_total'] = 
            parseFloat(recItemDatarow['rci_qty']) * parseFloat(recItemDatarow['rci_cost_per_unit']);
        
        console.log(recItemDatarow);
        return recItemDatarow;
    }
    
}
*/

/*
class record extends WinObject{
    static getWinObjectType(){
        return 'records';
    }
    
    static getPanelHtml(record){
        let itemsOnRecord = issetReturn(()=>win_rec_itemsGroupedByRec_id[record.rec_id],{});
        return `
            <div class="panel singleColumn">
                <div class="fw600 grid12">
                    <div class="fw600 gs8">${record.rec_description}</div>
                    <div class="fw600 gs4 jr">${price(record.rec_total)}</div>
                </div>
                <span onclick="toggleClassOnNextElement(this,'hidden');" class="click">
                    <div>Items (${Object.keys(itemsOnRecord).length} on project) &#9660;</div>
                </span>
                <div class="singleColumn gridGapSmall hidden">
                    <span class="button">Add New Item +</span>
                    ${Object.values(itemsOnRecord).map((item)=>`${rec_item.getSummaryLine(item)}`).join('')}
                </div>
            </div>
        `;
    }
    
    static getFormPanelHtml(record){
        let labelRow = win_info['records']['labels'];
        return `
            <div class="panel form">
                ${wrapSelectElement(`
                    ${project.getSelect('',`
                        placeholder="${labelRow.rec_prj_id}" name="rec_prj_id" checks="isNotBlank" 
                        oninput="record.updateFormWithProjectDetails(this,this.value);"
                    `)}
                `)}
                
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>record.rec_description,'')}"
                        placeholder="${labelRow.rec_description}" name="rec_description" checks="isNotBlank" 
                    >`
                    ,Object.keys(indexAnObjectOfObjects(win_records,'rec_description'))
                    ,''
                )}
                
                ${dateInput(`<input 
                    value="${issetReturn(()=>record.rec_timestamp_planned_start,'')}" checks="isNotBlank" 
                    placeholder="${labelRow.rec_timestamp_planned_start}" name="rec_timestamp_planned_start"
                >`)}
                <div class="flexGap">
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>record.rec_duration_qty,'1')}" 
                        name="rec_duration_qty" placeholder="${labelRow.rec_duration_qty}" 
                        checks="isInt_positive" class="width2Lh"
                    >`)}
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>record.rec_duration_unit,'hour')}"
                            placeholder="${labelRow.rec_duration_unit}" name="rec_duration_unit" 
                            checks="isNotBlank" 
                        >
                            ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                        </select>`
                    )}
                </div>
                <div>
                    <span class="borderBottom borderTop lh padSmall flexGap">
                        <span class="lightText">Total</span>
                        <span class="lightText">|</span>
                        <span class="jr" name="rec_price">
                            <input class="tar width3Lh" type="text" name="rec_total" value="${price('')}" readonly>
                        </span>
                    </span>
                </div>                
                <div class="buttonRow flexGap">
                    <button onclick="rec_item.appendFormAboveButtonRow(this,rec_item.getRecItemDefaultDatarowFromProjectId(getTargetElementValue(this,'form','[name=rec_prj_id]')));"><span class="flexGap"><span>+</span><div>Add Item</div></span></button>
                    <button onclick="rec_item.appendFormAboveButtonRow(this,rec_item.getRecItemDurationDatarowFromProjectId(getTargetElementValue(this,'form','[name=rec_prj_id]')));"><span class="flexGap"><span><i class="far fa-clock"></i></span><div>Add Duration</div></span></button>
                    <div class="flex1"></div>
                    <button onclick="record.addObjectFromAnyElementInForm(this);">Save Record</button>
                </div>
            </div>
        `;
    }
    
    static addFormsInForm(forms,addedObject=''){
        let datarowArray = Array.from(forms).map((form)=>{
            let datarow = rec_item.getFromForm(form);
            datarow['rci_rec_id'] = issetReturn(()=>addedObject['rec_id'],'');
            return datarow;
        });
        datarowArray.forEach(datarow=>rec_item.addObject(datarow));
    }
    
    static getSummaryLine(record){
        let prjRow = win_projects[record.rec_prj_id];
        return `${prjRow.prj_acronym}: ${formatTimestampToDate(record.rec_timestamp_planned_start)}: ${record.rec_description}`;
    }
    
    static updateFormWithProjectDetails(formChild,projectId){
        let form = formChild.classList.contains('form') ? formChild : getParentElementWithClass(formChild,'form');
        let project = win_projects[projectId];
        form.querySelector(`[name=rec_duration_qty]`).value = project['prj_default_duration_qty'];
        form.querySelector(`[name=rec_duration_unit]`).value = project['prj_default_duration_unit'];
    }
}







*/

class Contact extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'contact';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new ContactFormPanel(this.datarow);
        this.displayPanel = new ContactDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}


class Customer extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'customer';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new CustomerFormPanel(this.datarow);
        this.displayPanel = new CustomerDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}


class PrjCusLink extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'prj_cus_link';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new PrjCusLinkFormPanel(this.datarow);
        this.displayPanel = new PrjCusLinkDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}


class Project extends WinObject2{
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


class RecItem extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'rec_item';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new RecItemFormPanel(this.datarow);
        this.displayPanel = new RecItemDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}


class Record extends WinObject2{
    constructor(uniqueIdentifier=''){
        super();
        this.init(uniqueIdentifier);
    }
    
    init(uniqueIdentifier=''){
        this.winObjectType = 'record';
        this.initWinObject(uniqueIdentifier);
        this.formPanel = new RecordFormPanel(this.datarow);
        this.displayPanel = new RecordDisplayPanel(this.datarow);; 
        this.refresh();
    }
    
    refresh(){
        this.refreshWinObject();
    }
}


class ContactFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.winObjectType = 'contact';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    
    getHtml(){
        let labelrow = this.labelrow;
        return `
                ${wrapSelectElement(`
                    ${customer.getSelect('',`placeholder="${labelrow.con_cus_id}" name="con_cus_id" checks="isNotBlank"`)}
                `)}
                <div class="flexl1r2 flexGap">
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>contact.con_type,'phone')}"
                            onchange="ifElementIsNotValueDisableInputWithNameOnForm(this,'phone','con_method');"
                            placeholder="${labelrow.con_type}" name="con_type" checks="isNotBlank" 
                        >
                            ${win_contact_types.map(type=>`<option value="${type}">${ucFirst(type)}</option>`).join('')}
                        </select>`
                    )}
                    ${input(`<input 
                        type="text" value="${issetReturn(()=>contact.con_address,'')}" 
                        placeholder="${labelrow.con_address}" name="con_address"  
                    >`)}
                </div>
                ${wrapSelectElement(
                    `<select 
                        type="text" placeholder="${labelrow.con_method}" name="con_method" checks="isNotBlank" 
                        value="${issetReturn(()=>contact.con_method,'')}" 
                        ${issetReturn(()=>contact.con_type,'phone')!='phone' ? `disabled="disabled"` : ``}
                    >
                        ${win_contact_method.map(type=>`<option value="${type}">${ucFirst(type)}</option>`).join('')}
                    </select>`
                )}
                <div class="jr"><button onclick="new Contact().addUsingFormChild(this);">Save contact</button></div>
        `;
    }
}

class CustomerFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.winObjectType = 'customer';
        this.defaultClasses = ['formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    
    getHtml(){
        let labelrow = this.labelrow;
        
        return `
                ${input(`<input 
                    type="text" value="${issetReturn(()=>this.datarow.cus_first_name,'')}" 
                    placeholder="${labelrow.cus_first_name}" name="cus_first_name" checks="isNotBlank" 
                >`)}
                ${input(`<input 
                    type="text" value="${issetReturn(()=>this.datarow.cus_last_name,'')}" 
                    placeholder="${labelrow.cus_last_name}" name="cus_last_name" checks="isNotBlank" 
                >`)}
                <div class="buttonRow">
                    <button onclick="contact.appendFormAboveButtonRow(this)"><span class="flexGap"><span>+</span><div class="">Add Contact</div></span></button>
                    <div class="flex1"></div>
                    <button onclick="new Customer().addUsingFormChild(this);;"><span>Save Customer</span></button>
                </div>
        `;
    }
}

class PrjCusLinkFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.winObjectType = 'prj_cus_link';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    
    getHtml(){
        let labelrow = this.labelrow;
        return `
            ${wrapSelectElement(`
                ${project.getSelect('',`placeholder="${labelrow.prj_cus_link_prj_id}" name="prj_cus_link_prj_id" checks="isNotBlank"`)}
            `)}
            ${wrapSelectElement(`
                ${customer.getSelect('',`placeholder="${labelrow.prj_cus_link_cus_id}" name="prj_cus_link_cus_id" checks="isNotBlank"`)}
            `)}
            <div class="jr"><button onclick="new PrjCusLink().addUsingFormChild(this);">Save prj_cus_link</button></div>
        `;
    }
}

class ProjectFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.initProjectFormPanel(datarow);
    }
    
    initProjectFormPanel(datarow=''){
        this.winObjectType = 'project';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    getHtml(){
        let labelrow = this.labelrow;
        let primaryKey = win_info[this.winObjectType]['keys']['primary']
        let temporaryKey = win_info[this.winObjectType]['keys']['temp']
        
        return `
            <div>Pick a unique reference for this project</div>
            ${wrapInputElement(`<input 
                type="text" value="${issetReturn(()=>this.datarow.prj_acronym,'')}" name="prj_acronym" 
                checks="isNotBlank minChars_3" placeholder="${labelrow.prj_acronym}" 
                oninput="allProjects.ifInputValueIsSameAsProjectAcronymAddError(this);"
            >`)}
            <div>What is the address of this project?</div>
            ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_address_1,'')}" 
                name="prj_address_1" placeholder="${labelrow.prj_address_1}" checks="isNotBlank" 
            >`)}
            ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_address_2,'')}" 
                name="prj_address_2" placeholder="${labelrow.prj_address_2}" 
            >`)}
            <div class="flexGap flexl2r1">
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_city,'')}" 
                    name="prj_city" placeholder="${labelrow.prj_city}" checks="isNotBlank" 
                >`)}
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_postcode,'')}" 
                    name="prj_postcode" placeholder="${labelrow.prj_postcode}" checks="isNotBlank" 
                >`)}
            </div>
            <div>What work is usually done on this project?</div>
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>this.datarow.prj_default_work,'')}"
                    placeholder="${labelrow.prj_default_work}" name="prj_default_work" checks="isNotBlank" 
                >`
                ,win_work
            )}
            <div>What is the default unit of work?</div>
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>this.datarow.prj_default_unit,'')}"
                    placeholder="${labelrow.prj_default_unit}" name="prj_default_unit" checks="isNotBlank" 
                >`
                ,win_units
            )}
            <div>How many units of work will usually take place?</div>
            <div class="flexGap">
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_qty,'')}" 
                    name="prj_default_qty" placeholder="${labelrow.prj_default_qty}" checks="isFloat" 
                >`)}
                <div class="formLabel">Units</div>
            </div>
            <div>What is the rate charged per unit of work?</div>
            <div class="flexGap">
                <span class="formLabel">£</span>
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_rate_per_default_unit,'')}" 
                    name="prj_rate_per_default_unit" placeholder="${labelrow.prj_rate_per_default_unit}" 
                    checks="isFloat"
                >`)}
                <div class="formLabel">Per Unit</div>
            </div>
            <div>How often will the work take place?</div>
            <div class="flexGap">
                <div class="formLabel">Every</div>
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_repeat_every_qty,'1')}" 
                    name="prj_default_repeat_every_qty" placeholder="${labelrow.prj_default_repeat_every_qty}" 
                    checks="isInt_positive" class="width2Lh"
                >`)}
                ${wrapSelectElement(
                    `<select 
                        type="text" value="${issetReturn(()=>this.datarow.prj_default_repeat_every_unit,'')}"
                        placeholder="${labelrow.prj_default_repeat_every_unit}" name="prj_default_repeat_every_unit" checks="isNotBlank" 
                    >
                        ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                    </select>`
                )}
            </div>
            <div class="singleColumn gridGap0">
                <div>What is the usual duration of this work?</div>
                <div class="fs70 jr">(May be the same as the default unit and quantity)</div>
            </div>
            <div class="flexGap">
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_duration_qty,'1')}" 
                    name="prj_default_duration_qty" placeholder="${labelrow.prj_default_duration_qty}" 
                    checks="isInt_positive" class="width2Lh"
                >`)}
                ${wrapSelectElement(
                    `<select 
                        type="text" value="${issetReturn(()=>this.datarow.prj_default_duration_unit,'hour')}"
                        placeholder="${labelrow.prj_default_duration_unit}" name="prj_default_duration_unit" 
                        checks="isNotBlank" 
                    >
                        ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                    </select>`
                )}
            </div>
            <div class="singleColumn gridGap0">
                <div>What is the rate charged per unit of time worked?</div>
                <div class="fs70 jr">(Leave as 0 if not paid per unit of time)</div>
            </div>
            <div class="flexGap">                                                     
                <span class="formLabel">£</span>
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_cost_per_duration_unit,'0.00')}" 
                    name="prj_default_cost_per_duration_unit" placeholder="${labelrow.prj_default_cost_per_duration_unit}" 
                    checks="isInt_positive"
                >`)}
                <div class="formLabel">Per Unit</div>
            </div>
            <div class="buttonRow">
                <button onclick="prj_cus_link.appendFormAboveButtonRow(this);"><span class="flexGap"><span>+</span><div>Add Customer</div></span></button>
                <span class="flex1"></span>
                <button onclick="new Project().addUsingFormChild(this);">Save Project</button>
            </div>
        `;
    }
}

class RecItemFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.winObjectType = 'rec_item';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    
    getHtml(){
        let labelrow = this.labelrow;
        return `
            ${select(`
                <select placeholder="${labelrow.rci_rec_id}" name="rci_rec_id" checks="isNotBlank" >
                    <option value="">None</option>
                    ${Object.values(win_records).map((rec)=>{
                        let prjRow = win_projects[rec.rec_prj_id];
                        return `
                            <option value="${rec.rec_id}" ${rec.rec_id==issetReturn(()=>rec_item.rci_rec_id,'') ? `selected="selected"` : ``}>
                                ${prjRow.prj_acronym}: ${formatTimestampToDate(rec.rec_timestamp_planned_start)}: ${rec.rec_description}
                            </option>
                        `;
                    }).join('')}
                </select>
            `)}
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>rec_item.rci_work,'')}"
                    placeholder="${labelrow.rci_work}" name="rci_work" checks="isNotBlank" 
                >`
                ,
                Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_work'))
            )}
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>rec_item.rci_unit,'')}"
                    placeholder="${labelrow.rci_unit}" name="rci_unit" checks="isNotBlank" 
                >`
                ,
                Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_unit'))
            )}
            <div class="flexGap">
                <span class="lhSquare jc borderBottom borderTop">£</span>
                ${input(`<input 
                    type="number" value="${issetReturn(()=>rec_item.rci_cost_per_unit,'0.00')}" class="flex1"
                    oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                    placeholder="${labelrow.rci_cost_per_unit}" name="rci_cost_per_unit" checks="isNotBlank" 
                >`)}
                <span class="lhSquare jc borderBottom borderTop padSmall">x</span>
                ${input(`<input 
                    type="number" value="${issetReturn(()=>rec_item.rci_qty,'1')}" class="flex1" 
                    oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                    placeholder="${labelrow.rci_qty}" name="rci_qty" checks="isNotBlank" 
                >`)}
            </div>
            <div>
                <span class="borderBottom borderTop lh padSmall flexGap">
                    <span class="lightText">Total</span>
                    <span class="lightText">|</span>
                    <span class="jr" name="rci_price">
                        <input class="tar width3Lh" type="text" name="rci_total" value="${price('')}" readonly>
                    </span>
                </span>
                <span class="flex1"></span>
                <button onclick="new RecItem.addUsingFormChild(this);">Save rec_item</button>
            </div>
        `;
    }
}

class RecordFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.winObjectType = 'record';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    
    getHtml(){
        let labelrow = this.labelrow;
        return `
            <div class="panel form">
                ${wrapSelectElement(`
                    ${project.getSelect('',`
                        placeholder="${labelRow.rec_prj_id}" name="rec_prj_id" checks="isNotBlank" 
                        oninput="record.updateFormWithProjectDetails(this,this.value);"
                    `)}
                `)}
                
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>record.rec_description,'')}"
                        placeholder="${labelRow.rec_description}" name="rec_description" checks="isNotBlank" 
                    >`
                    ,Object.keys(indexAnObjectOfObjects(win_records,'rec_description'))
                    ,''
                )}
                
                ${dateInput(`<input 
                    value="${issetReturn(()=>record.rec_timestamp_planned_start,'')}" checks="isNotBlank" 
                    placeholder="${labelRow.rec_timestamp_planned_start}" name="rec_timestamp_planned_start"
                >`)}
                <div class="flexGap">
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>record.rec_duration_qty,'1')}" 
                        name="rec_duration_qty" placeholder="${labelRow.rec_duration_qty}" 
                        checks="isInt_positive" class="width2Lh"
                    >`)}
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>record.rec_duration_unit,'hour')}"
                            placeholder="${labelRow.rec_duration_unit}" name="rec_duration_unit" 
                            checks="isNotBlank" 
                        >
                            ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                        </select>`
                    )}
                </div>
                <div>
                    <span class="borderBottom borderTop lh padSmall flexGap">
                        <span class="lightText">Total</span>
                        <span class="lightText">|</span>
                        <span class="jr" name="rec_price">
                            <input class="tar width3Lh" type="text" name="rec_total" value="${price('')}" readonly>
                        </span>
                    </span>
                </div>                
                <div class="buttonRow flexGap">
                    <button onclick="rec_item.appendFormAboveButtonRow(this,rec_item.getRecItemDefaultDatarowFromProjectId(getTargetElementValue(this,'form','[name=rec_prj_id]')));"><span class="flexGap"><span>+</span><div>Add Item</div></span></button>
                    <button onclick="rec_item.appendFormAboveButtonRow(this,rec_item.getRecItemDurationDatarowFromProjectId(getTargetElementValue(this,'form','[name=rec_prj_id]')));"><span class="flexGap"><span><i class="far fa-clock"></i></span><div>Add Duration</div></span></button>
                    <div class="flex1"></div>
                    <button onclick="record.addObjectFromAnyElementInForm(this);">Save Record</button>
                </div>
            </div>
        `;
    }
}

class ContactDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'contact';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}


class CustomerDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'customer';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    getHtml(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        let contactsOnCustomer = issetReturn(()=>win_contactsGroupedByCus_id[this.datarow.cus_id],{});
        
        return `
            <div class="panel singleColumn">
                <div class="fw600 jc">${this.datarow.cus_first_name} ${this.datarow.cus_last_name}</div>
                ${Object.values(contactsOnCustomer).map((contactDatarow)=>{
                    let primaryContact = this.datarow.cus_primary_con_id==contactDatarow.con_id;
                    return `
                        <a class="flexl1r2 flexGap lh" href="${getHrefContactString(contactDatarow.con_method,contact.con_address,'hello world')}">
                            <div class="nowrap">${contactDatarow.con_type} [${contactDatarow.con_method}]</div>
                            <div class="jr flexGap">
                                <div class="jr">${contactDatarow.con_address}</div>
                                <span class="jc lightAccentBorder border borderRadius lhSquare">
                                    <span class="${primaryContact ? `accentText` : `transparent`}">&#9673;</span>
                                </span>
                            </div>
                        </a>
                    `;
                }).join('')}
                <button><span class="flexGap"><span>+</span><div>Add New Method Of Contact</div></span></button>
            </div>
        `;
    }
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}


class PrjCusLinkDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'prj_cus_link';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
        
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}


class ProjectDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'project';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    getHtml(datarow=''){
        //~ let customersOnProject = issetReturn(()=>win_customersGroupedByPrj_id[project.prj_id],{});
        //~ let recordsOnProject = issetReturn(()=>win_recordsGroupedByPrj_id[project.prj_id],{});
        
        //~ let primaryCustomer = issetReturn(()=>win_customers[project.prj_primary_cus_id],{});
        //~ let primaryContact = issetReturn(()=>win_contacts[primaryCustomer.cus_primary_con_id],{});
        
        datarow = datarow=='' ? this.datarow : datarow;
        
        let customersOnProject = issetReturn(()=>win_customersGroupedByPrj_id[datarow.prj_id],{});
        let recordsOnProject = issetReturn(()=>win_recordsGroupedByPrj_id[datarow.prj_id],{});
        
        let primaryCustomer = issetReturn(()=>win_customers[datarow.prj_primary_cus_id],{});
        let primaryContact = issetReturn(()=>win_contacts[primaryCustomer.cus_primary_con_id],{});
        
        return `
            <div class="fw600">
                <div>${this.getSummaryLine()}</div>
                <div class="flex1 jr">${price(datarow.prj_rate_per_default_unit)}/${datarow.prj_default_unit}</div>
            </div>
            <span>
                <span>
                    ${datarow.prj_default_qty} ${datarow.prj_default_unit}s
                    every
                    ${datarow.prj_default_repeat_every_qty} ${datarow.prj_default_repeat_every_unit}s
                </span>
            </span>
            ${Object.values(customersOnProject).map(customer=>`
                <div class="grid12 ${primaryCustomer.cus_id==customer.cus_id ? `lightBg` : ``}">
                    <span class="gs4 borderRight">${customer.cus_first_name} ${customer.cus_last_name}</span>
                    <div class="gs8 singleColumn">
                        ${Object.values(issetReturn(()=>win_contactsGroupedByCus_id[customer.cus_id],{})).map(contact=>`
                            <a class="jc" href="${getHrefContactString(contact.con_method,contact.con_address,'hello world')}">
                                ${customer.cus_primary_con_id == contact.con_id ? `<span class="accentText">&#9673;</span>` : ``}
                                ${contact.con_address} 
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            <span onclick="toggleClassOnNextElement(this,'hidden');" class="click">
                <div>Records (${Object.keys(recordsOnProject).length} on project) &#9660;</div>
            </span>
            <div class="singleColumn hidden flex1">
                <span><button><span>Add Record</span></button></span>
                ${Object.values(recordsOnProject).map(record=>`
                    <div class="grid12">
                        <div class="gs4 borderRight">${formatTimestampToDate(record.rec_timestamp_planned_start)}</div>
                        <div class="gs8">${record.rec_description}</div>
                    </div>
                `).join('')}
            </div>
            <div class="jr"><button><span class="icon"><i class="fas fa-pencil-ruler"></i></span></button></div>
        `;
    }
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `${datarow.prj_acronym}: ${[datarow.prj_address_1,datarow.prj_city].filter((entry)=>entry.trim()!='').join(',  ')}`;
    }
}


class RecItemDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'rec_item';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}


class RecordDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'record';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    getHtml(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        let itemsOnRecord = issetReturn(()=>win_rec_itemsGroupedByRec_id[record.rec_id],{});
        return `
            <div class="panel singleColumn">
                <div class="fw600 grid12">
                    <div class="fw600 gs8">${record.rec_description}</div>
                    <div class="fw600 gs4 jr">${price(record.rec_total)}</div>
                </div>
                <span onclick="toggleClassOnNextElement(this,'hidden');" class="click">
                    <div>Items (${Object.keys(itemsOnRecord).length} on project) &#9660;</div>
                </span>
                <div class="singleColumn gridGapSmall hidden">
                    <span class="button">Add New Item +</span>
                    ${Object.values(itemsOnRecord).map((item)=>`${rec_item.getSummaryLine(item)}`).join('')}
                </div>
            </div>
        `;
    }
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}


function defaultInputWithWrapperFunction(input){
    inputWrapperUpdate(input);
}

function defaultDateInputWithWrapperFunction(input){
    dateInputWrapperUpdate(input);
}

function defaultSelectWithWrapperFunction(input){
    inputWrapperUpdate(input);
}

function loadIndexPage(){
	displayHeaderBarContents();
	if(win_loggedIn){
        //~ 
    }else {
        loadLoginHtml();
    }
}

async function initPage(page=''){
    //create idb connection - to be used in get/put actions
    idb = await openIndexedDB();
    
    //should only be run on first load - will overwrite edited datarows
    if(dev){await populateIdbWithSampleData();}
    
    //stores all datarows from idb in window[`idb_${tableName}`]
    await initDbVars();
    
    //initialises list objects; allProjects = new Projects() etc.
    initWinObjects();
    
    //initialises winVars
    initWinVars();
    //~ initSecondaryWinVars()
    
    //~ load page
    initDom(page);
}


//~ openIndexedDB() is in aux_indexedDb.js


async function populateIdbWithSampleData(){
    for(winVar of primaryWinVars){
        let tableName = `${winVar}s`;
        for(datarow of Object.values(window[`win_${tableName}_sampleData`])){
            await addDatarow(tableName,datarow);
        }
    }

    return new Promise(resolve=>resolve(true));
}


async function initDbVars(){
    for(winVar of primaryWinVars){
        let tableName = `${winVar}s`;
        window[`idb_${tableName}`] = await getAllDatarows(tableName);
    }
    return new Promise(resolve=>resolve(true));
}


//~ initWinObjects() is in page_winObjects.js
//~ initWinVars() is in page_winVars.js


function initDom(page=''){
    page = page=='' ? getPage() : page;
    page = page=='' ? page = 'index.php' : page;
    pageName = page.split('.')[0];
    refreshDom(pageName);
}

function getLoginHtml(params={}){
	let container = issetReturn(()=> params.container, true);
	let useGet = issetReturn(()=> params.useGet, false);
	
	let json = issetReturn(()=>params.json,{});
	json = useGet ? getJsonFromGetArray() : json;
	json = initJson(json);
	
	return `${container 
				? `<div class="panel singlePanel singleColumn" id="loginForm">`
				: ``
			}
				<h1 class="alignCenter">Log In</h1>
				${isset(()=>json.errors['0']) ? json.errors[0].map((error)=>`<p>${error}</p>`).join('') : ``}
				${isset(()=>json.errors['usr_email']) ? json.errors.usr_email.map((error)=>`<p>${error}</p>`).join('') : ``}
				<input type="text" name="usr_email" placeholder="Email" value="${isset(()=>json.datarow.usr_email) ? json.datarow.usr_email : ''}">
				
				${isset(()=>json.errors.usr_password)? json.errors.usr_password.map((error)=>`<p>${error}</p>`).join(''): ``}
				<input type="password" name="usr_password" placeholder="Password" value="${isset(()=>json.datarow.usr_password) ? json.datarow.usr_password : ''}">
				
				<div class="alignCenter"><button name="submitLogin" onclick="submitLogin();">Log In!</button></div>
			${container ? '</div>' : ''}`;
}

function loadLoginHtml(params={}){
    clearMain();
	appendToMain(getLoginHtml(params));
}

async function submitLogin(){
	let currentFile = getCurrentFilename();
	
	let file = 'nav/login.nav.php?nav=submitLogin';
	let f = getElementValues({'getValuesFrom':'loginForm'});
	
	let response = await ajax({'file':file,'f':f});
	json = initJson(response);
	
	let datarow = json.datarow;
	let success = (!json.valid || !json.exists ? false : true);
	let printTo = initElement('loginForm');
	
	if(success){goto('index.php');}
	else{printTo.innerHTML = getLoginHtml({'json':json,'container':false});}
	
}

async function logout(){
    if(dev){console.error('logout function not written yet');}
    let response = initJson(await ajax({'file':'nav/login.nav.php?nav=logout'}));
    if(response==true){window.location.href='index.php';}
}

async function userIsLoggedIn(){
    return true;
}

function updateInputOnFormWithNameRci_total(formChild){
    let form = formChild.classList.contains('form') ? formChild : getParentElementWithClass(formChild,'form');
    
    let totalElm = form.querySelector('input[name="rci_total"]')
    let qtyElm = form.querySelector('input[name="rci_qty"]')
    let costPerUnitElm = form.querySelector('input[name="rci_cost_per_unit"]')
    
    totalElm.value = price(parseFloat(qtyElm.value) * parseFloat(costPerUnitElm.value));
}
function changeValueOfInputWithNameRciWorkOnFormToThisValue(elmChild){
    let form = getParentElementWithClass(elmChild,'form')
    form.querySelector('input[name="rci_work"]').value = elmChild.value;
}

function changeValueOfInputWithNameOnFormToThisValue(name,elmChild){
    let form = getParentElementWithClass(elmChild,'form')
    form.querySelector(`input[name="${name}"]`).value = elmChild.value;
}


function refreshDom(pageName=''){
    pageName = pageName=='' ? currentPageName : pageName;
    currentPageName = pageName;
    switch(pageName){
        case 'index':displayHeaderBar('');appendToMain(`<div class="panel singlePanel">At Index.php</div>`);break;
        case 'contacts':allContacts.loadPage();break;
        case 'customers':allCustomers.loadPage();break;
        case 'prj_cus_links':allPrjCusLinks.loadPage();break;
        case 'projects':allProjects.loadPage();break;
        //~ case 'prj_cus_links':prj_cus_link.loadPage();break;
        //~ case 'records':record.loadPage();break;
        //~ case 'rec_items':rec_item.loadPage();break;
        case 'records':allRecords.loadPage();break;
        case 'rec_items':allRecItems.loadPage();break;
    }
}

function initWinObjects(){
    allCustomers   = new Customers();
    allContacts    = new Contacts();
    allPrjCusLinks = new PrjCusLinks();
    allProjects    = new Projects();
    allRecords     = new Records();
    allRecItems    = new RecItems();
}


function refreshWinObjects(){
    //~ allProjects.refresh();
    allCustomers.refresh();
    allContacts.refresh();   
    allPrjCusLinks.refresh();
    allProjects.refresh();
    allRecords.refresh();
    allRecItems.refresh();
}

const primaryWinVars = ['project','customer','prj_cus_link','contact','record','rec_item'];
const secondaryWinVars = ['win_customersGroupedByPrj_id','win_contactsGroupedByCus_id','win_recordsGroupedByPrj_id','win_rec_itemsGroupedByRec_id','win_units','win_work'];


function initWinVars(){
    refreshWinVars();
}


function refreshWinVars(){
    refreshPrimaryWinVars();
    refreshSecondaryWinVars();
}


function refreshPrimaryWinVars(){
    allContacts.refresh();
    allCustomers.refresh();
    allPrjCusLinks.refresh();
    allProjects.refresh();
    allRecItems.refresh();
    allRecords.refresh();

    //~ allProjects.init();
    
    //~ customer.initObjects();
    //~ win_prj_cus_links = mergeTwoIndexedObjects(idb_prj_cus_links,mightyStorage.get('prj_cus_links',{}));
    //~ win_contacts = mergeTwoIndexedObjects(idb_contacts,mightyStorage.get('contacts',{}));
    //~ win_rec_items = mergeTwoIndexedObjects(idb_rec_items,mightyStorage.get('rec_items',{}));
    //~ record.initObjects();
}


function refreshSecondaryWinVars(){
    win_customersGroupedByPrj_id = indexObjectsUsingLinkObjects('prj_cus_link','project','customer');
    win_contactsGroupedByCus_id = groupAnObjectOfObjectsByIndex(win_contacts,'con_cus_id'); 
    win_recordsGroupedByPrj_id = groupAnObjectOfObjectsByIndex(win_records,'rec_prj_id'); 
    win_rec_itemsGroupedByRec_id = groupAnObjectOfObjectsByIndex(win_rec_items,'rci_rec_id'); 
    win_units = [...win_time_units,...Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_unit')),...Object.keys(indexAnObjectOfObjects(win_projects,'prj_default_unit'))];
    win_work = [...Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_work')),...Object.keys(indexAnObjectOfObjects(win_projects,'prj_default_work'))];
}

function searchArrayOfObjects(arr,index,value){
    let arr2 = [];
    arr.forEach((item)=>{
        if(item[index]==value){
            arr2.push(item);
        }
    });
    return arr2;
}

//~ function only used if index is unique, returns {1:{...},2:{...},3:{...}}
function indexAnArrayOfObjects(arr,index){
    let obj = {};
    arr.forEach((item)=>obj[item[index]] = item);
    return obj;
}

//~ group in arrays - used where index is not unique - returns {1:[4:{},5:{}...],2:[...],3:[...]}
function groupAnArrayOfObjectsByIndex(arr,index){
    let obj = {};
    arr.forEach((item)=>obj[item[index]] = []);
    arr.forEach((item)=>obj[item[index]].push(item));
    return obj;
}

function convertHtmlStringToElements(htmlString){
    let div = document.createElement('template');
    div.insertAdjacentHTML('beforeend', htmlString);
    return div.children;
}

function convertHtmlStringToElement(htmlString){
    return convertHtmlStringToElements(htmlString)[0];
}

function convertElementToHtmlString(elm){
    let div = document.createElement('div');
    div.appendChild(elm);
    return div.innerHTML;
}

//~ ************ Date Functions ***************/



function convertDateStringAndTimeStringToDateObject(dateString,timeString){
    timeString = timeString=='' ? '00' : timeString;
    
    let timeArray = timeString.split(':');
    while(timeArray.length<3){timeArray.push('00');}
    timeString = timeArray.join(':')
    
    return new Date(`${dateString}T${timeString}Z`);
}

function convertDateStringAndTimeStringToTimestamp(dateString,timeString){
    let dt = convertDateStringAndTimeStringToDateObject(dateString,timeString);
    return dt.getTime();
}

function getDateFromDateObject(dt){
    return `
        ${dt.getFullYear()}-${dt.getMonth().toString().padStart(2,`0`)}-${dt.getDate().toString().padStart(2,`0`)}
    `;
}

function getTimeFromDateObject(dt){
    return `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
}

function getTimestampFromDateObject(dt){
    return dt.getTime();
}

function getCurrentTime(){
	return Math.floor(Date.now() / 1000);
}

function formatTimestampToDate(timestamp){
	return new Date(parseInt(timestamp)).toLocaleDateString();
}


/*

function toFormattedDateTime(timestamp){
    timestamp = parseInt(timeStamp)
	let today = new Date(timeStamp).setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
	let t = new Date(timeStamp);
	
	return today ? t.toLocaleTimeString() : t.toLocaleDateString();
    
	//~ var t = new Date(0);
	//~ var t1 = new Date(0);
	//~ t.setSeconds(timestamp);
	//~ t1.setSeconds(timestamp);
	
	//~ var todaysDate = new Date();
	//~ var today = t1.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0);
	
	//~ return today ? t.toLocaleTimeString() : t.toLocaleDateString();
}

function toShortDateTime(timestamp){
	var t = new Date(0);
	t.setSeconds(timestamp);
	return `${t.toLocaleDateString()}  ${t.toLocaleTimeString()}`;
}

function formatTimestampToDateTime(timestamp){
	var t = new Date(0);
	t.setSeconds(timestamp);
	return `${t.toLocaleDateString()}  ${t.toLocaleTimeString()}`;
}

*/

function removeClassOnElements(class1,elements){
    elements = isElement(elements) ? [elements] : elements;
    elements.forEach(element=>element.classList.remove(class1));
}

function addClassOnElements(class1,elements){
    elements = isElement(elements) ? [elements] : elements;
    elements.forEach(element=>element.classList.add(class1));
}

function toggleClassOnNextElement(elm,class1){
    elm.nextElementSibling.classList.toggle(class1);
}

function toggleClassOnElementsInsideElement(class1,qsString,parentElement){
    parentElement.querySelectorAll(qsString).forEach(elm=>elm.classList.toggle(class1));
}

function toggleClassOnElementsInsideElementAndFocusChildIfClassRemoved(class1,qsString,parentElement){
    parentElement.querySelectorAll(qsString).forEach(elm=>{
        if(elm.classList.contains(class1)){
            elm.classList.remove(class1);
            getAllInputs(elm).forEach(input=>{input.focus();input.disabled="";});
        }
        else{
            elm.classList.add(class1);
            getAllInputs(elm).forEach(input=>{input.disabled="disabled";});
        }
    });
}


//~ ************ Json Functions *************** //
function initJson(json){
	return (isJsonString(json) ? JSON.parse(json) : json);
}

function isJsonString(str) {
	try {JSON.parse(str);return true;} catch(e) {return false;}
}

function prettifyJson(json={}){
	json = isJsonString(json) ? JSON.parse(json) : json;
	return '<pre>' + JSON.stringify(json,null,4) + '</pre>';
}


function mergeTwoIndexedObjects(obj1,obj2){
    let newObject = obj1;
    Object.keys(obj2).forEach(key=>newObject[key] = obj2[key]);
    return newObject;
}


function convertObjectToObjectOfObjects(object,index){
    let newObject = {};
    newObject[object[index]] = object;
    return newObject;
}


function indexAnObjectOfObjects(objectOfObjects,index){
    let newObject = {};
    Object.keys(objectOfObjects).forEach(key=>{
        let object = objectOfObjects[key];
        let indexValue = object[index];
        newObject[indexValue] = object;
    });
    return newObject;
}


function groupAnObjectOfObjectsByIndex(objectOfObjects,index){
    let newObject = {};
    Object.keys(objectOfObjects).forEach(key=>{
        let object = objectOfObjects[key];
        let indexValue = object[index];
        if(!isset(()=>newObject[indexValue])){newObject[indexValue] = {}};
        newObject[indexValue][key] = object;
    });
    return newObject;
}


function indexObjectsUsingLinkObjects(linkWinObjectType,indexWinObjectType,objectWinObjectType){
    let newObject = {};
    let indexPrimaryKey = win_info[indexWinObjectType][`keys`][`primary`];
    let objectPrimaryKey = win_info[objectWinObjectType][`keys`][`primary`];
    
    Object.keys(window[`win_${indexWinObjectType}s`]).forEach(indexId => newObject[indexId] = {});
    
    Object.values(window[`win_${linkWinObjectType}s`]).forEach(link =>{
        let indexId = link[`${linkWinObjectType}_${indexPrimaryKey}`];
        let objectId = link[`${linkWinObjectType}_${objectPrimaryKey}`];
        newObject[indexId][objectId] = window[`win_${objectWinObjectType}s`][objectId];
    });
    
    return newObject;
}

function ucFirst(str1){
	return str1.charAt(0).toUpperCase() + str1.slice(1);
}

function ucFirstOfEachWord(str){
	return str.split(' ').map((val)=>ucFirst(val)).join(' ');
}

function formatStringForTitle(str){
    return ucFirstOfEachWord(str.replace(/-/g, " ").replace(/_/g, " "));
}
function formatStringForLabel(str){
    return formatStringForTitle(str).replace(/ /g, "");
}

function formatString(str){
	return `${str.replace(/-/g, " ")}`;
}

function escapeHtmlTags(str){
	return str.replace(new RegExp('<', 'g'), '&lt');
}

function price(num,currency='£'){
    num = num=='' ? 0 : num;
    return `${currency}${parseFloat(num).toFixed(2)}`;
}

function randomString(length=5){
    return Math.random().toString(36).substr(2,length);
}

function tempIdString(){
    return `temp_${win_user['usr_id']}_${getCurrentTime()}_${randomString(5)}`;
}




function showInfoBar(text='',seconds=30){
	let id = `infoBar${new Date().getMilliseconds()}`;
	let html = `<div id="${id}" class="infoBar"><div>${text}</div></div>`
	document.querySelector('body').insertAdjacentHTML('afterbegin',html);
	setTimeout(()=>document.getElementById(id).remove(),seconds*1000);
}

function changeTargetElements(sourceElement,qsStringOrElms,changeValueFunction='',limitSearchToParentElementClass=''){
    let value = getInputValue(sourceElement)
    let parentElement = parentElementClass=='' ? document.body : getParentElementWithClass(parentElementClass);
    let targetElements = parentElement.querySelectorAll(qsString);
    let newValue = changeValueFunction=='' ? value : changeValueFunction(value);
    changeElmValues(target,newValue);
}

function changeDateTimeInputsOnForm(sourceElement){
    let value = getInputValue(sourceElement);
    let isTimestamp = checkValue('isTimestamp',value);
    let timestampInputName = isTimestamp ? sourceElement.name : sourceElement.name.split('_').slice(0,-1).join('_');
    
    let form = sourceElement.parentWithClass('form');
    let dateInput = form.querySelector(`name=${timestampInputName}_date`);
    let timeInput = form.querySelector(`name=${timestampInputName}_time`);
    let timestampInput = form.querySelector(`name=${timestampInputName}`);
    
    if(isTimestamp){
        let dt = new Date(parseInt(value));
        dateInput.value = dt.getMyDate();
        timeInput.value = dt.getMyTime();
    } else {
        let dt = new Date(`${dateInput.value} ${timeInput.value}`);
        timestampInput = dt.getTime();
    }
}






function changeAllElementsInParentWithClassUsingQuerySelectorToValue(elmChild,class1,qsString,value){
    let elms = getAllElementsInParentWithClassUsingQuerySelector(elmChild,class1,qsString);
    elms.forEach((elm)=>{changeElmValue(elm,value)});
}

function changeElmValue(elm,value){
    if(['SELECT','INPUT','OPTION','BUTTON'].indexOf(elm.tagName)>-1){elm.value=value;}
    else{elm.innerHTML = value;}
}

function changeElmValues(elms,value){
    elms = Array.isArray(elms) ? elms : [elms]
    elms.forEach(elm=>changeElmValue(elm,value));
}


function changeValueOfInputWithNameOnParentWithClassToThisValue(name,class1,elmChild){
    let form = getParentElementWithClass(elmChild,'form')
    form.querySelector(`input[name="${name}"]`).value = elmChild.value;
}

function copyValueToInputWithSameNameNoSuffixOnParentWithClass(elmChild,class1){
    name = elmChild.name.split('_').slice(0,-1).join('_');
    let parent = getParentElementWithClass(elmChild,class1);
    parent.querySelector(`input[name="${name}"]`).value = elmChild.value;
}

function defaultCopyValueToInput(elm){
    copyValueToInputWithSameNameNoSuffixOnParentWithClass(elm,'panel');
}

function convertInputElementToSelectElement(input,options=[],blankOption=`None`){
    //~ does not replace element in DOM
    let inputString = getHtmlStringFromElement(input);
    let selectString = `
        ${inputString.replace('input','select')}
            ${blankOption===false ? `` : `<option value="">${blankOption}</option>`}
            ${options.map(opt=>`<option value="${opt}"${input.value==opt ? `selected="selected"` : ``}>${opt}</option>`).join('')}
        </select>
    `;
    
    let select = createElementFromHtmlString(selectString);
    return select;
}

function ifElementIsNotValueDisableInputWithNameOnForm(elm,value,name){
    let form = getParentElementWithClass(elm,'form');
    let input = form.querySelector(`[name="${name}"]`)
    let inputWrapper = getParentElementWithClass(input,'inputWrapper');
    if(getInputValue(elm)!=value){
        input.disabled = 'disabled';
        inputWrapper.classList.add('disabled')
    } else {
        input.disabled = '';
        inputWrapper.classList.remove('disabled')
    }
}



function dateInput(inputString,runChecks=false){
    let input = createElementFromHtmlString(inputString);
    if(input.tagName!='INPUT'){console.error(input);console.error(`The input string passed does not create an input.`);}
    
    let inputPlaceholder = input.getAttribute('placeholder');
    let inputValueDate = input.value=='' ? new Date() : new Date(input.value);
    
    input.placeholder='';
    input.setAttribute('oninput',`defaultDateInputWithWrapperFunction(this);${input.getAttribute('onchange')};`);
    //~ input.setAttribute('onfocusout',`defaultDateInputWithWrapperFunction(this);${input.getAttribute('onfocusout')};`);
    
    let realInput = convertInputElementToDateInputElement(input,'hidden');
    realInput.readOnly = "readonly"
    input.name='';
    let timeInput = convertInputElementToDateInputElement(input,'time');
    let dateInput = convertInputElementToDateInputElement(input,'date');
    let inputWrapperClasses = ['inputWrapper','inputFilled'];
    if(runChecks){wrapperClasses.push(dt.getTime()!=NaN ? `inputValid` : `inputInvalid`);}
    
    return `
        <div class="singleColumn gridGapSmall">
            <div class="dateInputWrapper flexl2r1 flexGap">
                <div class="${inputWrapperClasses.join(' ')}">
                    ${getHtmlStringFromElement(dateInput)}
                    <div class="inputLabel">${inputPlaceholder} Date</div>
                </div>
                <div class="${inputWrapperClasses.join(' ')}">
                    ${getHtmlStringFromElement(timeInput)}
                    <div class="inputLabel">Time</div>
                </div>
                ${getHtmlStringFromElement(realInput)}
            </div>
        </div>
    `;
}

function dateInputWrapperUpdate(elm){
    inputWrapperUpdate(elm);
    let dateInputWrapper = getParentElementWithClass(elm,'dateInputWrapper');
    let dateString = dateInputWrapper.querySelector('input[type=date]').value;
    let timeString = dateInputWrapper.querySelector('input[type=time]').value;
    
    dateInputWrapper.querySelector('input[type=hidden]').value = 
        convertDateStringAndTimeStringToTimestamp(dateString,timeString);
}

function updateOriginalInputDate(elm){
    let originalElm = getOriginalElementInForm(initElement(elm));
    originalElm.value = elm.value;
}


function convertInputElementToDateInputElement(inputElm,inputType='DATE'){
    inputType = inputType.toLowerCase();
    
    let inputValueDate = inputElm.value=='' ? new Date() : new Date(inputElm.value);
    let newInputElm = copyElm(inputElm);
    
    newInputElm.type = inputType;
    switch(newInputElm.type){
        case 'date': newInputElm.setAttribute('value',inputValueDate.getMyDate());break;
        case 'time': newInputElm.setAttribute('value',inputValueDate.getMyTime());break;
        case 'hidden': newInputElm.value=inputValueDate.getTime();break;
    }
    return newInputElm;
}

function getTargetElementValue(elmChild,parentClass,qsString){
    let parent = elmChild.classList.contains('form') ? elmChild : getParentElementWithClass(elmChild,parentClass);
    return parent.querySelector(`${qsString}`).value;
}


function getParentElementWithClass(elm,class1){
    let parent = elm.parentElement;
    if(parent.classList.contains(class1)){
        return parent;
    } else {
        return getParentElementWithClass(parent,class1);
    }
}

function removeParentElementWithClass(elm,class1){
    getParentElementWithClass(elm,class1).remove();
}

function getOriginalElementInForm(elm){
    if(elm.name.slice(-5)!='_copy'){console.error(`Element passed in getOriginalElementInForm() must have a name ending in "_copy"`);}
    let parent = getParentElementWithClass(elm,'form');
    return parent.querySelector(`[name=${elm.name.slice(0,-5)}]`);
}


function getAllInputs(elm){
    elm = initElement(elm)
    return Array.from(elm.querySelectorAll('input,select,textarea'));
}

function getAllElementsInParentWithClassUsingQuerySelector(elmChild,class1,qsString){
    let parent = getParentElementWithClass(elmChild,class1);
    return parent.querySelectorAll(qsString);
}

function setTitle(title=''){
    document.querySelector('title').innerHTML = `${win_projectLabel}${title==`` ? `` : ` | ${title}`}`;
}

function displayHeaderBar(page=''){
	document.querySelector('header').innerHTML = getHeaderBarHtml();
	highlightHeaderTab(page);
}

function getHeaderBarHtml(){
    return `${getHeaderTabsHtml()}${getHeaderSettingsHtml()}`;
}

function getHeaderTabsHtml(){
    let fileType = getUrl().split('.').slice(-1).join();
    return `<span id="tabs">
                ${win_pages.map((page)=>`
                    <a  class="tab" id="tab_${page}" ${fileType=='php' ? `href="${page}.php"` : `onclick="${page.slice(0,-1)}.loadPage();"`}>${formatStringForTitle(page)}</a>
                `).join('')}
            </span>`;
}

function getHeaderSettingsHtml(){
    return `<span id="settings">${win_loggedIn ? `` : `<a onclick="loadLoginHtml()">Log In</a>`}</span>`;
}

function highlightHeaderTab(page=''){
	document.querySelectorAll('.tab').forEach((tab)=>{
		if(tab.id == `tab_${page}`){tab.classList.add('highlight');}
		else {tab.classList.remove('highlight');}
	});
}

function wrapInputElement(inputString,runChecks=false){
    return input(inputString,runChecks);
}

function input(inputString,runChecks=false){
    let input = createElementFromHtmlString(inputString);
    if(input.tagName!='INPUT'){console.error(input);console.error(`The input string passed does not create an input.`);}
    
    let inputPlaceholder = input.getAttribute('placeholder');
    let wrapperClasses = [...input.classList, ...['inputWrapper']];
    input.placeholder = '';
    input.classList = [];
    
    input.extendAttribute('oninput',`defaultInputWithWrapperFunction(this);`);
    
    if(input.value!=''){wrapperClasses.push('inputFilled');}
    if(runChecks){wrapperClasses.push(checkInput(input) ? `inputValid` : `inputInvalid`);}
    
    return `
        <div class="${wrapperClasses.join(' ')}">
            ${getHtmlStringFromElement(input)}
            <div class="inputLabel">${inputPlaceholder}</div>
        </div>
    `;
}

function inputWrapperUpdate(input){
    let parent = getParentElementWithClass(input,'inputWrapper')
    if(input.value==''){parent.classList.remove('inputFilled');}else{parent.classList.add('inputFilled');}
    changeClassesOnInputWrapperIfValid(input,checkInput(input));
}

function changeClassesOnInputWrapperIfValid(input,valid){
    if(valid){
        input.parentElement.classList.remove('inputError');
        input.parentElement.classList.add('inputValid');
    }else{
        input.parentElement.classList.add('inputError');
        input.parentElement.classList.remove('inputValid');
    }

}


function inputSelect(inputString,options,blankOption=`None`,runChecks=false){
    let originalInput = createElementFromHtmlString(inputString);
    if(originalInput.tagName!='INPUT'){console.error(originalInput);console.error(`The input string passed does not create an input.`);}
    originalInput.extendAttribute('oninput',`defaultCopyValueToInput(this);`)
    
    let input = copyElm(originalInput);
    input.name = `${originalInput.name}_input`;
    input.disabled = 'disabled';
    input.classList.add('hidden');
    
    let select = convertInputElementToSelectElement(originalInput,options,blankOption);
    select.name = `${originalInput.name}_select`;
    
    let hiddenInput = copyElm(originalInput);
    hiddenInput.type = 'hidden';
    hiddenInput.setAttribute('oninput','');
    
    return `
        <div class="flexGap inputSelectWrapper">
            <button class="lhSquare" onclick="defaultToggleInputSelectBehaviour(this);">
                <i class="fas fa-pencil-alt hidden"></i><i class="far fa-hand-point-up"></i>
            </button>
            ${wrapInputElement(getHtmlStringFromElement(input))}
            ${wrapSelectElement(getHtmlStringFromElement(select))}
            ${getHtmlStringFromElement(hiddenInput)}
        </div>
    `;
}


function defaultToggleInputSelectBehaviour(element){
    let inputSelectWrapper = element.classList.contains('inputSelectWrapper') 
        ? element : getParentElementWithClass(element,'inputSelectWrapper');
    toggleClassOnElementsInsideElementAndFocusChildIfClassRemoved('hidden',`i,.inputWrapper`,inputSelectWrapper)
}


function appendToMain(html){
	//~ appendNthInMain('last',html);
    html = typeof(html)=='string' ? html : getHtmlStringFromElement(html);
    document.querySelector('main').insertAdjacentHTML('beforeend',html);
}

function appendNthInMain(position,html){
	position = position=='' || position=='first' ? 0 : position;
    html = typeof(html)=='string' ? html : getHtmlStringFromElement(html);
    
    let itemsInMain = document.querySelectorAll('main > *');
	if(itemsInMain.length==0 || position=='last' || position>=itemsInMain.length){appendToMain(html);return;}
    
	itemsInMain[position].insertAdjacentHTML('beforeBegin',html);
}

function appendPanelInMain(html){
    appendToMain(`<div class="panel">${html}</div>`)
}

function clearMain(){
	document.querySelector('main').innerHTML = '';
}

function createElementFromHtmlString(htmlString){
    return createElementsFromHtmlString(htmlString)[0];
}

function createElementsFromHtmlString(htmlString){
    if(devVerbose){console.error('createElementFromHtmlString() & createElementsFromHtmlString() deprecated - use convertHtmlStringToElement()');}
    
    let div = document.createElement('template');
    div.insertAdjacentHTML('beforeend', htmlString);
    return div.children;
    //~ return document.createElement('template').insertAdjacentHTML('beforeend', htmlString).children;
}

function getHtmlStringFromElement(elm){
    if(devVerbose){console.error('getHtmlStringFromElement() deprecated - use convertElementToHtmlString()');}
    
    let div = document.createElement('div');
    div.appendChild(elm);
    return div.innerHTML;
}

function copyElm(elm){
    return createElementFromHtmlString(getHtmlStringFromElement(elm));
}

function findParentWithClass(elm,class1){
    console.error('findParentWithClass() deprecated, change to getParentElementWithClass()');
    return getParentElementWithClass(elm,class1);
}

function findOriginalElementInForm(elm){
    console.error('findOriginalElementInForm() deprecated, change to getOriginalElementInForm()');
    return getOriginalElementInForm(elm);
}


function focusNextInputOnForm(formChild){
    let form = getParentElementWithClass(formChild,'form');
    let allElmsInForm = form.querySelectorAll('*');
    let indexOfFormChild = allElmsInForm.indexOf(formChild);
    
    let elmsAfterFormChild = allElmsInForm.slice(-5);
    elmsAfterFormChild.forEach((elm)=>{
        if(elm.tagName=='INPUT' || elm.tagName=='SELECT' || elm.tagName=='TEXTAREA'){
            elm.focus();
        }
    })
}

function findParentPanel(elm){
    return getParentElementWithClass(elm,'panel');
}

function copyValueToCopyElmsInPanel(elm){
    let value = elm.value;
    let panel = findParentPanel(elm);
    
    panel.querySelectorAll(`*[name='copy_${elm.getAttribute("name")}']`).forEach(elm2=>elm2.innerHTML=`${value}`);
}


//~ ************ Response Log Functions *************** //
function createResponseLog(){
	if(!document.getElementById('responseLog')){
		let rlog = '<div id="responseLog" class="hidden"></div>';
		document.querySelector('#content').insertAdjacentHTML('afterbegin',`
            <div id="responseLog" class="hidden">
                <div id="responseLogButtons">
                    <button onclick="window.scrollTo(0,1)">
                        Scroll
                    </button>
                </div>
                <div id="responseLogContent"></div>
            </div>
        `);
	}
}

function showInResponseLogContent(json){
    createResponseLog();
	document.getElementById('responseLogContent').innerHTML = prettifyJson(json);
}

function toggleResponseLog(){
	if(!document.getElementById('responseLog')){createResponseLog();}
	document.getElementById('responseLog').classList.toggle("hidden");
}



function wrapSelectElement(selectString,runChecks=false){
    return select(selectString,runChecks);
}

function select(selectString,runChecks=false){
    let select = createElementFromHtmlString(selectString);
    if(select.tagName!='SELECT'){console.error(select);console.error(`The select string passed does not create an input.`);}
    
    let selectPlaceholder = select.getAttribute('placeholder');
    let wrapperClasses = [...select.classList,...['selectWrapper','inputWrapper']];
    
    select.placeholder = '';
    select.extendAttribute('oninput',`defaultSelectWithWrapperFunction(this);`);
    //~ select.extendAttribute('onchange',`defaultSelectWithWrapperFunction(this);`);
    //~ select.extendAttribute('onfocus',`this.onchange();`);
    
    changeValueOfSelect(select)
    if(select.value!=''){wrapperClasses.push('inputFilled');}
    if(runChecks){wrapperClasses.push(checkInput(select) ? `inputValid` : `inputInvalid`);}
    
    return `
        <div class="${wrapperClasses.join(' ')}">
            ${getHtmlStringFromElement(select)}
            <div class="inputLabel">${selectPlaceholder}</div>
        </div>
    `;
}

function changeValueOfSelect(select,value=''){
    value = value=='' ? select.getAttributeIfSet('value') : value;
    Array.from(select.options).some((opt,key)=>{
        if(opt.value==value){opt.setAttribute('selected',true);return true;}
    });
    return select;
}

function isset(array){
	//~ TO USE: isset(() => arr1.json.datarow.wobble.blah) ? 'true' : 'false';
	try{return typeof array() !== 'undefined'}
	catch (e){return false;}
}

function issetReturn(array,value=''){
	//~ TO USE: issetReturn(() => arr1.json.datarow.wobble.blah,value);
	//~ CANNOT USE isset as a replacement for the next 3 lines of code - WHY??? WHO CARES!!!
	var istrue;
	try {istrue = typeof array() !== 'undefined';}
	catch (e){istrue = false;}
	
	return istrue ? array() : value;
}

function roughSizeOfObjectInBytes(object) {
    var objectList = [];
    var stack = [ object ];
    var bytes = 0;
    while (stack.length) {
        var value = stack.pop();
        if (typeof(value) === 'boolean' ) {bytes += 4;}
        else if(typeof value === 'string' ) {bytes += value.length * 2;}
        else if(typeof value === 'number' ) {bytes += 8;}
        else if(typeof value === 'object' && objectList.indexOf( value ) === -1){
            objectList.push( value );
            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

function roughSizeOfObject(object,unit='b'){
    let bytes = roughSizeOfObjectInBytes(object);
    switch(unit.toLowerCase()){
        case 'b':return `${bytes} bytes`;
        case 'kb':return `${bytes/1000} kilobytes`;
        case 'mb':return `${bytes/1000000} megabytes`;
        case 'gb':return `${bytes/1000000000} gigabytes`;
    }
    if(bytes>1000000){return `${bytes/1000000} megabytes`;}
    if(bytes>1000){return `${bytes/1000} kilobytes`;}
    return `${bytes} bytes`;
}

function valid(elm){
    elm = initJson(elm);
    let valid = true;
    getAllInputs(elm).forEach(input=>{
        if(!input.disabled && !input.readOnly){
            input.oninput();
            //~ if(input.name=='prj_acronym'){console.log(input.parentElement);}
            if(input.parentElement.classList.contains('inputError') && !input.parentElement.classList.contains('inputDisabled'))
                {valid = false;}
            if(!checkInput(input)){valid = false;}
        }
    });
    return valid;
}


function checkValue(check,value){
    let checkArray = check.split('_');
    switch(checkArray[0]){
        case '':
        return true;
        
        case 'moreThan':
        return parseFloat(value) > parseFloat(checkArray[1]);
        
        case 'lessThan':
        return parseFloat(value) < parseFloat(checkArray[1]);
        
        case 'maxChars':
        return value.length <= checkArray[1];
        
        case 'minChars':
        return value.length >= checkArray[1];
        
        case 'doesNotEqual':
        return value!=checkArray[1];
        
        case 'isTimestamp':
        return value == parseInt(value);
        
        case 'isTimeString':
        return new Date(`1970-01-01 ${value}`)!='Invalid Date';
        
        case 'isTimeString':
        return new Date(`${value}`)!='Invalid Date'
        
        case 'isNotBlank':
        return value!='';

        case 'isNumber':
        return value == parseFloat(value);

        case 'isInt':
            if(issetReturn(()=>checkArray[1],'')=='positive' && parseInt(value)<=0){return false;}
            if(issetReturn(()=>checkArray[1],'')=='negative' && parseInt(value)>=0){return false;}
        return value == parseInt(value);
        

        case 'isFloat':
        return value == parseFloat(value);
        
        case 'isPrice':
        return value == parseFloat(value);
    }
    console.error(`The function checkValue() does not have a test for ${check}`);
}

function checkInput(input){
    if(input.disabled){return true;}
    let checks = input.getAttribute('checks');
    checks = checks==null || checks.trim()=='' ? [] : input.getAttribute('checks').split(' ');
    return checks.every((check)=>checkValue(check,getInputValue(input)));
}

function checkInputWrapper(input){
    let inputWrapper = input.classList.contains('inputWrapper') ? input : getParentElementWithClass(input,'inputWrapper');
}


function getInvalidInputs(elm){
    elm = initElement(elm);
    let invalidInputs = [];

    getAllInputs(elm).forEach(input=>{
        if(!checkInput(input)){invalidInputs.push(input);}
    });
    return invalidInputs;
}


function isJson(str){
    try {JSON.parse(str);}
    catch(e) {return false;}
    return true;
}

function isObject(object){
    if(!object instanceof Array){return false;}
    if(typeof(object)=='object'){return true;}
}

function isObjectOfObjects(objectOfObjects){
    if(!isObject(objectOfObjects)){return false;}
    return Object.values(objectOfObjects).every(object=>isObject(object));
}

function isArray(array){
    return array instanceof Array;
}

function isArrayOfObjects(arrayOfObjects){
    if(!isArray(arrayOfObjects)){return false;}
    return arrayOfObjects.every(object=>isObject(object));
}

function isElement(element){
    if(element==null){return false;}
    return element.nodeName!=undefined;
}

function isElementId(elementId){
    return document.getElementById(elementId)==null;
}

function isEditableElement(element){
    if(!isElement(element)){return false;}
    return element.tagName=='INPUT' || element.tagName=='TEXTAREA' ||element.tagName=='SELECT';
}

//~ *********** Ajax Functions ************* //
function ajax(params={}) {
	let file = issetReturn(()=>params.file); //~ !essential parameter!
	let f = issetReturn(() => params.f,new FormData);
	let nav = issetReturn(()=>params.nav); //~ !pass in file or essential parameter!
	
	if(nav!=''){f.append('nav',nav);}
	
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open("POST", file);
		request.onload = (()=>{
			if (request.status == 200){
				//~ ONLY TRUE IN DEV ////////////////////////////////////////////////////////////
				if(true){showInResponseLogContent(request.response);}
				resolve(request.response);
			} 
			else {reject(Error(request.statusText));}
		});
		request.onerror = (()=>{reject(Error("Network Error"));});
		request.send(f);
	});
}

async function ajaxTarget(params={}){
	let file = issetReturn(()=>params.file); //~ !essential parameter!
	let f = issetReturn(()=>params.f,new FormData);
	let getValuesFrom = issetReturn(()=>params.getValuesFrom); //~ getValuesFrom can pass idString or elm 
	
	f = getElementValues({'f':f,'getValuesFrom':getValuesFrom});
	let response = await ajax({'file':file,'f':f});
	return response;
}



    //~ static get(key,ifnull=null){
    //~ static getAll(){
    //~ static set(key,item){
    //~ static remove(key){
    //~ static addItems(key,items){
    //~ static addItem(key,item){

class mightyStorage {
    static get(key,ifnull=null){
        let lsItem = localStorage.getItem(key);
        return lsItem===null ? ifnull : JSON.parse(lsItem);
    }
    
    static getWithKey(key){
        let rtn = {};
        rtn[key] = this.get(key);
        return rtn;
        
    }
    
    static getAll(){
        let newCache = {};
        Object.keys(localStorage).forEach(key=>newCache[key] = this.get(key));
        return newCache;
    }
    
    static removeAll(){
        Object.keys(localStorage).forEach(key=>this.remove(key));
    }
    
    static after(key=''){
        return key=='' ? this.getAll() : this.getWithKey(key);
    }
    
    static set(key,item){
        localStorage.setItem(key,JSON.stringify(item));
        return this.after(key);
    }
    
    static remove(key){
        localStorage.removeItem(key);
        return this.after(key);
    }

    static addItems(key,items){
        let cacheArray = this.get(key,[]);
        return this.set(key,[...items,...cacheArray]);
    }
    
    static addItem(key,item){
        item = [item];
        return this.addItems(key,item);
    }
    
    static addObjectsToObjectOfObjects(key,objects){
        //~ must be in format {5:{'cus_id':5,'cus_usr_id':4,...},18:{...},28:{...},...}
        if(!isObjectOfObjects(objects)){console.error(`This is not an object of objects: ${JSON.stringify(objects)}`);return false;}
        
        let cacheObjects = getFromCache(key,{});
        return this.set(key,mergeTwoIndexedObjects(cacheObjects,objects))
    }
    
    static addObjectToObjectOfObjects(key,object,index){
        //~ must be in format {'cus_id':5,'cus_usr_id':4,...}
        let indexValue = object[index];
        let newObject = {};
        newObject[indexValue] = object;
        return this.addObjectsToObjectOfObjects(key,newObject);
    }
    
    static addObject(key,object,index=''){
        if(index==''){return this.addItem(key,object);}
        else{return this.addObjectToObjectOfObjects(key,object,index);}
    }
    
    static addObjects(key,objects){
        if(isArrayOfObjects(objects)){return this.addItems(key,objects);}
        else{return this.addObjectsToObjectOfObjects(key,objects);}
    }
}


function getFromCache(key,ifnull=null){
    let lsItem = localStorage.getItem(key);
    lsItem = isJson(lsItem) ? JSON.parse(lsItem) : lsItem;
    return lsItem===null ? ifnull : lsItem;
}

function setToCache(key,value){
    localStorage.setItem(key,typeof(value)=='string' ? value : JSON.stringify(value));
}

function removeFromCache(key){
    localStorage.removeItem(key);
}

function addObjectsToArrayInCache(key,objects){
    objects = Array.isArray(objects) ? objects : [objects];
    
    let cacheArray = getFromCache(key,[]);
    setToCache(key,[...objects,...cacheArray]);
}

function addObjectsToObjectsInCache(key,objects){
    //~ must be in format {1:{},7:{},312:{}}
    
    objects = isWinObject(objects) ? convertObjectToObjectOfObjects(objects,key) : objects;
    
    let cacheObjects = getFromCache(key,{});
    setToCache(key,mergeTwoIndexedObjects(cacheObjects,objects));
}

function addObjectToObjectsInCache(key,object){
    //~ must be in format {'cus_id':5,'cus_usr_id':4...}
    
    let primaryKey = win_keys[key]['primary'];
    let primaryKeyValue = object[primaryKey];
    object = {primaryKeyValue:object};
    addObjectsToObjectsInCache(key,object);
}



//~ ********** Generic functions - used on all pages ************* //
function initFormData(f=''){
	return f=='' ? new FormData: f;
}

function initElement(element=''){
    if(isElement(element)){return element;}
    if(isElementId(element)){return document.getElementById(element);}
    console.error(`Is not an element`)
}

function online(){
    if(dev){console.error('online() is not set up to check if online [ping google? better to ping server but could be slower]');}
    return true;
}

function getHrefContactPrefix(method){
    return {sms:'sms:',email:'mailto:',whatsapp:'whatsapp://send?phone='}[method];
}

function getHrefContactTextWord(method){
    return {sms:'?body=',email:'?body=',whatsapp:'&text='}[method];
}

function getHrefContactText(text){
    return encodeURI(text);
}

function getHrefContactString(method,address,text=''){
    return getHrefContactPrefix(method) + address + getHrefContactTextWord(method) + getHrefContactText(text);
}

function getUrl(){
    return window.location.href;
}

function getPage(){
    
    return getUrl().split('/').slice(-1)[0];
}

function getElementValues(params={}){
	let f = issetReturn(() => params.f,new FormData);
	let getValuesFrom = initElement(issetReturn(()=>params.getValuesFrom));
	
	if(getValuesFrom!=='' && getValuesFrom!==undefined && getValuesFrom!==null){
		let all = getValuesFrom.querySelectorAll('input,select,textarea');
		let valid;
		for(let i=0; i<all.length; i++){
			valid = true;
			if(all[i].name==''){valid=false;}
			if(all[i].type=='checkbox' && all[i].checked==false){valid=false;}
			if(valid){f.append(all[i].name,all[i].value);}
		}
	}
	return f;
}

function getInputValuesAsObject(form){
	form = initElement(form);
    let object = {};
    let valid = true;
	
	if(form=='' || form==undefined || form==null){return object;}
	
    getAllInputs(form).forEach((input)=>{
        valid = true;
        if(input.name==''){valid=false;}
        if(input.type=='checkbox' && input.checked==false){valid=false;}
        if(valid){object[input.name] = getInputValue(input);}
    });
	return object;
}

function getJsonFromGetArray(){
	var getArray = getGetArray();
	var json = issetReturn(()=>getArray.json,{});
	return decodeURI(json);
}

function getCurrentFilename(){
	return window.location.href.split('/').pop().split('?')[0];
}

function getGetArray(){
	var getString = window.location.search.substring(1);
	var getArray = {};
	
	if(getString.length>0){
		var getPairs = getString.split('&');
		for(key in getPairs){getArray[getPairs[key].split('=')[0]] = getPairs[key].split('=')[1];}
	}
	
	return getArray;
}

function getInputValue(input){
    input = initElement(input);
    switch(input.tagName){
        case 'INPUT':
            if(input.type=='checkbox' && input.value==''){return input.checked;}
            return input.value;
        break;
        
        case 'SELECT':
            return input.value;
        break;
        
        case 'TEXTAREA':
            return input.innerHTML;
        break;
    }
}

function changeInputValue(input,value){
    input = initElement(input);
    switch(input.tagName){
        case 'INPUT':
            input.value = value;
        break;
        
        case 'SELECT':
            input.value = value;
        break;
        
        case 'TEXTAREA':
            input.innerHTML = value;
        break;
    }
}

function openIndexedDB(){
    let indexedDBRequest = indexedDB.open(win_projectName);
    return new Promise((resolve, reject) => {
        indexedDBRequest.onupgradeneeded = dbEvent => {
            console.log('updating DB');
            let idb = dbEvent.target.result;
            primaryWinVars.forEach(winVar => {
                let tableName = `${winVar}s`;
                if(!Array.from(idb.objectStoreNames).includes(tableName)){
                    idb.createObjectStore(tableName, {keyPath: win_info[winVar]['keys']['temp']});
                }
            });
        }
        indexedDBRequest.onsuccess = dbEvent => {resolve(dbEvent.target.result);}
		indexedDBRequest.onerror = () => {reject(Error("IndexedDb request error"));}
    });
}


/* *********  Generic Table Functions  ************** */

async function getDatarow(tableName,id){
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let getRequest = idb.transaction([tableName]).objectStore(tableName).get(id);
        
        getRequest.onsuccess = getEvent => {
            tableDatarow = getEvent.target.result;
            resolve(tableDatarow);
        }
    });
}


async function addDatarow(tableName,datarow){
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let addRequest = idb.transaction([tableName], "readwrite").objectStore(tableName).add(datarow);
        
        addRequest.onsuccess = addEvent => {resolve(datarow);}
        addRequest.onerror = addEvent => {resolve(false);}
    });
}


async function changeDatarow(tableName,datarow){
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let putRequest = idb.transaction([tableName], "readwrite").objectStore(tableName).put(datarow);
        
        putRequest.onsuccess = putEvent => {resolve(datarow);}
        putRequest.onerror = putEvent => {resolve(false);}
    });
}


async function getAllDatarows(tableName){
    let datarows = {};
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let iterateRequest = idb.transaction([tableName]).objectStore(tableName).openCursor()

        iterateRequest.onsuccess = iterateEvent => {
            let cursor = iterateEvent.target.result;
            if(cursor) {
                datarows[cursor.key] = cursor.value;
                cursor.continue();
            } else {
                resolve(datarows);
            }
        }
        //~ iterateRequest.onerror = iterateEvent => {resolve(false)}
    });
}


async function removeDatarow(tableName,id) {
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let deleteRequest = idb.transaction([tableName],'readwrite').objectStore(tableName).delete(id);
        
        deleteRequest.onsuccess = deleteEvent => {resolve(true);}
        deleteRequest.onerror = deleteEvent => {resolve(true);}
    });
}



/* *********** Example Table Functions *********** */
/*
async function showEmployee(id=''){
    id = id=='' ? getDatarowFromMyForm().id : id;
    let tableDatarow = await getDatarow('employees',id);
    
    let message = tableDatarow!==undefined ? tableDatarow : `No employee exists with id: ${id}`;
    showInMain(message);
}


async function showAllEmployees(){
    let tableDatarows = await getAllDatarows('employees');
    showInMain(tableDatarows.map(datarow=>`<div>${datarow.id}: ${JSON.stringify(datarow)}</div>`).join(''));
}


async function addEmployee(datarow=''){
    datarow = datarow=='' ? getDatarowFromMyForm() : datarow;
    
    //~ let tableDatarow = await getDatarow('employees',datarow.id);
    //~ if(tableDatarow!==undefined){
        //~ showInMain(`An employee already exists with that id: ${JSON.stringify(tableDatarow)}`);
        //~ return;
    //~ }
    
    let addResponse = await addDatarow('employees',datarow);
    //~ tableDatarow = await getDatarow('employees',datarow.id);
    
    //~ appendToMain(employeePanel(datarow));
    //~ resetMyForm();
}


async function removeEmployee(id=''){
    id = id=='' ? getDatarowFromMyForm().id : id;
    
    let tableDatarow = await getDatarow('employees',id);
    if(tableDatarow===undefined){
        showInMain(`An employee does not exist with that id: ${id}`);
        return;
    }
    
    let removeResponse = await removeDatarow('employees',id);
    let message = `employee removed ${removeResponse ? `successfully` : `unsuccessfully`}`
    showInMain(message);
}


async function changeEmployee(datarow=''){
    datarow = datarow=='' ? getDatarowFromMyForm() : datarow;
    
    let tableDatarow = await getDatarow('employees',datarow.id);
    if(tableDatarow===undefined){
        showInMain(`An employee does not exist with that id: ${datarow.id}`);
        return;
    }
    
    let changeResponse = await changeDatarow('employees',datarow);
    let message = `employee changed ${changeResponse ? `successfully` : `unsuccessfully`}`
    showInMain(message);
}

*/


