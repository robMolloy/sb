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
