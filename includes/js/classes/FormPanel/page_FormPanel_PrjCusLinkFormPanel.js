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
