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
