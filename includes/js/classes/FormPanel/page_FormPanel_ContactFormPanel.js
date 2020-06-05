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
