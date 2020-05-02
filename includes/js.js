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

String.prototype.toDate = function(){return new Date(this.valueOf());}

String.prototype.toggleSuffix = function(suffix){
    if(this.slice(-suffix.length)==suffix){return this.slice(0,-suffix.length);} else {return `${this}${suffix}`;}
}



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


class formObject {
    constructor(formChild){
        this.constructorElement = formElement;
        this.form = formElement.classList.contains('form') ? formElement : getParentElementWithClass(formElement,'form');
        return this;
    }
    
    function changeInputWithNameToElementValue(name,element=''){
        element = element=='' ? this.constructorElement : element;
        let input = this.form.querySelector(`[name="${name}"]`);
        changeInputValue(input,value);
    }
    
    function enableInputWithName(name){
        
    }
    
    function elementValueIs(){
        
    }
}

class contact extends winObject{
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


class customer extends winObject{
    static getWinObjectType(){
        return 'customers';
    }
    
    static getPanelHtml(customer){
        let contactsOnCustomer = issetReturn(()=>win_contactsGroupedByCus_id[customer.cus_id],{});
        
        return `
            <div class="panel singleColumn">
                <div class="fw600 jc">${customer.cus_first_name} ${customer.cus_last_name}</div>
                ${Object.values(contactsOnCustomer).map((contact)=>`
                    <a class="grid12" href="${getHrefContactString(contact.con_method,contact.con_address,'hello world')}">
                        <div class="gs4">${contact.con_description} [${contact.con_method}]</div>
                        <div class="gs7 jr">${contact.con_address}</div>
                        <div class="gs1 jc border">
                            <span class="${customer.cus_primary_con_id == contact.con_id ? `error` :`transparent`}">&#9673;</span>
                        </div>
                    </a>
                `).join('')}
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
                <div>
                    <button class="icon"><span class="flexGap"><span>+</span><div>Add Contact</div></span></button>
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
}








class prj_cus_link extends winObject{
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
    
    static getLinkToProjectFormHtml(){
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




class project extends winObject{
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
                    <div class=" flex1 jr">£${project.prj_rate_per_default_unit}/${project.prj_default_unit}</div>
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
                <div class="jr"><button><span class="icon"><i class="fas fa-pencil-ruler" style=""></i></span></button></div>
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
                    ,win_units
                )}
                <div>What unit is work usually measured in?</div>
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>project.prj_default_unit,'')}"
                        placeholder="${labelRow.prj_default_unit}" name="prj_default_unit" checks="isNotBlank" 
                    >`
                    ,win_units
                )}
                <div>How many units will the work usually take?</div>
                <div class="flexGap">
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>project.prj_default_qty,'')}" 
                        name="prj_default_qty" placeholder="${labelRow.prj_default_qty}" checks="isFloat" 
                    >`)}
                    <div class="borderTop borderBottom padSmall jc width3Lh">Units</div>
                </div>
                <div>What is the rate charged per unit?</div>
                <div class="flexGap">
                    ${wrapInputElement(`<input type="text" value="${issetReturn(()=>project.prj_rate_per_default_unit,'')}" 
                        name="prj_rate_per_default_unit" placeholder="${labelRow.prj_rate_per_default_unit}" 
                        checks="isFloat"
                    >`)}
                    <div class="borderTop borderBottom padSmall jc nowrap width3Lh">Per Unit</div>
                </div>
                <div>How often will the work take place?</div>
                <div class="flexGap">
                    <div class="padSmall borderTop borderBottom width3Lh jc">Every</div>
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>project.prj_default_repeat_every_qty,'1')}" 
                        name="prj_default_repeat_every_qty" placeholder="${labelRow.prj_default_repeat_every_qty}" 
                        checks="isInt_positive" class="width3Lh"
                    >`)}
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>project.prj_default_repeat_every_unit,'')}"
                            placeholder="${labelRow.prj_default_repeat_every_unit}" name="prj_default_repeat_every_unit" checks="isNotBlank" 
                        >
                            ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`)}
                        </select>`
                    )}
                </div>
                <div class="buttonRow">
                    <button onclick="project.addCustomerForm(this);"><span class="flexGap"><span>+</span><div>Add Customer</div></span></button>
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
    
    static addCustomerForm(formChild){
        let form = formChild.classList.contains('form') ? formChild : getParentElementWithClass(formChild,'form');
        form.querySelector('.buttonRow').insertAdjacentHTML('beforeBegin',prj_cus_link.getLinkToProjectFormHtml());
    }
}

class rec_item extends winObject{
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
                            </option>`;
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
                            <input class="tar width3Lh" type="text" name="rci_total" value="${price('')}" readonly>
                        </span>
                    </span>
                    <span class="flex1"></span>
                    <button onclick="rec_item.addObjectFromAnyElementInForm(this);">Save rec_item</button>
                </div>
            </div>
        `;
    }
    
    
}


class record extends winObject{
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
                    ${project.getSelect('',`placeholder="${labelRow.rec_prj_id}" name="rec_prj_id" checks="isNotBlank"`)}
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
                
                <div class="jr"><button onclick="record.addObjectFromAnyElementInForm(this);">Save Record</button></div>
            </div>
        `;
    }
    
    static getSummaryLine(record){
        let prjRow = win_projects[record.rec_prj_id];
        return `${prjRow.prj_acronym}: ${formatTimestampToDate(record.rec_timestamp_planned_start)}: ${record.rec_description}`;
    }
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

function showInfoBar(text='',seconds=30){
	let id = `infoBar${new Date().getMilliseconds()}`;
	let html = `<div id="${id}" class="infoBar"><div>${text}</div></div>`
	document.querySelector('body').insertAdjacentHTML('afterbegin',html);
	setTimeout(()=>document.getElementById(id).remove(),seconds*1000);
}

function changeAllElementsInParentWithClassUsingQuerySelectorToValue(elmChild,class1,qsString,value){
    let elms = getAllElementsInParentWithClassUsingQuerySelector(elmChild,class1,qsString);
    elms.forEach((elm)=>{changeElmValue(elm,value)});
}

function changeElmValue(elm,value){
    elm = initElement(elm);
    if(['SELECT','INPUT','OPTION','BUTTON'].indexOf(elm.tagName)>-1){elm.value=value;}
    else{elm.innerHTML = value;}
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

function getParentElementWithClass(elm,class1){
    let parent = elm.parentElement;
    if(parent.classList.contains(class1)){
        return parent;
    } else {
        return getParentElementWithClass(parent,class1);
    }
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
	document.querySelector('main').insertAdjacentHTML('beforeend',html);
}

function appendNthInMain(position,html){
	let itemsInMain = document.querySelectorAll('main > *');
	position = position=='' || position=='first' ? 0 : position;
	position = position>=itemsInMain.length ? 'last' : position;
	
	if(position=='last'){appendToMain(html);}
	else{itemsInMain[position].insertAdjacentHTML('beforeBegin',html);}
}

function appendPanelInMain(txt){
    appendToMain(`<div class="panel">${txt}</div>`)
}

function clearMain(){
	document.querySelector('main').innerHTML = '';
}

function createElementFromHtmlString(htmlString){
    return createElementsFromHtmlString(htmlString)[0];
}

function createElementsFromHtmlString(htmlString){
    let div = document.createElement('template');
    div.insertAdjacentHTML('beforeend', htmlString);
    return div.children;
    //~ return document.createElement('template').insertAdjacentHTML('beforeend', htmlString).children;
}

function getHtmlStringFromElement(elm){
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
                    <div class="button jc" onclick="ajax({'file':'nav/css.nav.php?nav=refreshCss'});">
                        Refresh CSS
                    </div>
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

function ucFirst(str1){
	return str1.charAt(0).toUpperCase() + str1.slice(1);
}

function ucFirstOfEachWord(str){
	return str.split(' ').map((val)=>ucFirst(val)).join(' ');
}

function formatStringForTitle(str){
	return ucFirstOfEachWord(str.replace(/-/g, " "));
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


//~ fetches data from the server incliudes refreshWinVars
async function initWinVars(winVar){
    await initPrimaryWinVars();
    initSecondaryWinVars();
}

function initPrimaryWinVars(){
    getPrimaryWinVars().forEach(async (winVar)=>await initPrimaryWinVar(winVar));
    refreshPrimaryWinVars();
}

function initSecondaryWinVars(){
    refreshSecondaryWinVars();
}

//~ manipulates cache(localStorage) and winDbVar data to get refresh winVars
function refreshWinVars(){
    refreshPrimaryWinVars();
    refreshSecondaryWinVars();
}

function refreshPrimaryWinVars(){
    getPrimaryWinVars().forEach(winVar=>refreshPrimaryWinVar(winVar));
}

function refreshSecondaryWinVars(){
    getSecondaryWinVars().forEach(winVar=>initSecondaryWinVar(winVar));
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

function initPage(page=''){
    page = page=='' ? getPage() : page;
    if(page=='' && dev){window.location.href = 'index.php';return;}
    pageName = page.split('.')[0];
    switch(pageName){
        case 'index':displayHeaderBar('');appendToMain(`<div class="panel">At Index.php</div>`);break;
        case 'customers':customer.loadPage();break;
        case 'contacts':contact.loadPage();break;
        case 'projects':project.loadPage();break;
        case 'records':record.loadPage();break;
        case 'prj_cus_links':prj_cus_link.loadPage();break;
        case 'rec_items':rec_item.loadPage();break;
    }
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



function getPrimaryWinVars(){
    return ['win_projects','win_customers','win_prj_cus_links','win_contacts','win_records','win_rec_items'];
}

function getSecondaryWinVars(){
    //~ return ['win_customersGroupedByPrj_id','win_customersIndexedByCus_id','win_contactsIndexedByCon_id','win_contactsGroupedByCus_id','win_recordsGroupedByPrj_id','win_rec_itemsGroupedByRec_id'];
    return ['win_customersGroupedByPrj_id','win_contactsGroupedByCus_id','win_recordsGroupedByPrj_id','win_rec_itemsGroupedByRec_id','win_units','win_work'];
}

async function initPrimaryWinVar(winVar){
    if(devVerbose && online()){
        switch(winVar){
            case 'win_loggedIn': win_loggedIn = await userIsLoggedIn(); break;
            case 'win_pages': break;
            case 'win_projects': win_projects = await fetchProjects(); break;
            case 'win_customers': win_customers = await fetchCustomers(); break;
            case 'win_prj_cus_links': win_prj_cus_links = await fetchPrjCusLinks(); break;
            case 'win_contacts': win_contacts = await fetchContacts(); break;
            default:console.error(`${winVar} cannot be initiated, case does not exist in initWinVar()`);
        }
    }
}

async function initSecondaryWinVar(winVar){
    switch(winVar){
        case 'win_customersGroupedByPrj_id': win_customersGroupedByPrj_id = getCustomersGroupedByPrj_id(); break;
        case 'win_contactsGroupedByCus_id': win_contactsGroupedByCus_id = groupAnObjectOfObjectsByIndex(win_contacts,'con_cus_id'); break;
        case 'win_recordsGroupedByPrj_id': win_recordsGroupedByPrj_id = groupAnObjectOfObjectsByIndex(win_records,'rec_prj_id'); break;
        case 'win_rec_itemsGroupedByRec_id': win_rec_itemsGroupedByRec_id = groupAnObjectOfObjectsByIndex(win_rec_items,'rci_rec_id'); break;
        case 'win_units': win_units = Object.keys(mergeTwoIndexedObjects(indexAnObjectOfObjects(win_rec_items,'rci_unit'),indexAnObjectOfObjects(win_projects,'prj_default_unit')));break;
        case 'win_work': win_work = Object.keys(mergeTwoIndexedObjects(indexAnObjectOfObjects(win_rec_items,'rci_work'),indexAnObjectOfObjects(win_projects,'prj_default_work')));break;
        
        default:console.error(`${winVar} cannot be initiated, case does not exist in initWinVar()`);
    }
}

function refreshPrimaryWinVar(winVar){
    switch(winVar){
        case 'win_projects':        project.initObjects();break;
        case 'win_customers':       customer.initObjects();break;
        case 'win_prj_cus_links':   win_prj_cus_links = mergeTwoIndexedObjects(win_db_prj_cus_links,mightyStorage.get('win_prj_cus_links',{}));break;
        case 'win_contacts':        win_contacts = mergeTwoIndexedObjects(win_db_contacts,mightyStorage.get('win_contacts',{}));break;
        case 'win_rec_items':       win_rec_items = mergeTwoIndexedObjects(win_db_rec_items,mightyStorage.get('win_rec_items',{}));break;
        case 'win_records':         record.initObjects();break;
        
        default:console.error(`${winVar} cannot be refreshed, case does not exist in refreshWinVar()`);
    }
}

function getCustomersGroupedByPrj_id(){
    let customer = {};let cus_id = 0;
    let project = {};let prj_id = 0;
    let prj_idIndexedCustomers= {};
    let cusLinksOnProject = {};
    
    let cusLinksOnProjects = groupAnObjectOfObjectsByIndex(win_prj_cus_links,'prj_cus_link_prj_id');
    
    Object.keys(win_projects).forEach((prjKey)=>{
        project = win_projects[prjKey];
        prj_id = project.prj_id;
        prj_idIndexedCustomers[prj_id] = {};
        
        cusLinksOnProject = issetReturn(()=>cusLinksOnProjects[prj_id],{});
        Object.keys(cusLinksOnProject).forEach((cusLinkKey)=>{
            cus_id = cusLinksOnProject[cusLinkKey].prj_cus_link_cus_id;
            customer = win_customers[cus_id];
            prj_idIndexedCustomers[prj_id][cus_id] = customer;
        });
    });
    return prj_idIndexedCustomers;
}



//~ async function fetchWinObjects(winObjectType){
    //~ if(devVerbose){console.error('fetchWinObjects() is currently not set up to fetch data from server-side');}
    //~ return getWinDbObjects(winObjectType);
    //~ return win_db_projects;
//~ }
async function fetchWinObjects(winObjectType){
    if(devVerbose){console.error('fetchWinObjects() is currently not set up to fetch data from server-side');}
    return window[`win_db_${winObjectType}`];
}


async function updateWinDbObjects(winObjectType){
    winDbObjects = await fetchWinObjects(winObjectType);
    window[`win_db_${winObjectType}`] = fetchWinObjects(winObjectType);
}
