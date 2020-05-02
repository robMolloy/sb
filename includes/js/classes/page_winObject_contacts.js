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
