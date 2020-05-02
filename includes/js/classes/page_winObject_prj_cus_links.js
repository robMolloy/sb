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


