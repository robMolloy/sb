
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







