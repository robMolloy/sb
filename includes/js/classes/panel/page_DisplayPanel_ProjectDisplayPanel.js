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

