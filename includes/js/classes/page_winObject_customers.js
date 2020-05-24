
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







