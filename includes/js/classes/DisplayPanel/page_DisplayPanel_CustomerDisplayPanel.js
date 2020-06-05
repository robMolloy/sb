class CustomerDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'customer';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    getHtml(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        let contactsOnCustomer = issetReturn(()=>win_contactsGroupedByCus_id[this.datarow.cus_id],{});
        
        return `
            <div class="panel singleColumn">
                <div class="fw600 jc">${this.datarow.cus_first_name} ${this.datarow.cus_last_name}</div>
                ${Object.values(contactsOnCustomer).map((contactDatarow)=>{
                    let primaryContact = this.datarow.cus_primary_con_id==contactDatarow.con_id;
                    return `
                        <a class="flexl1r2 flexGap lh" href="${getHrefContactString(contactDatarow.con_method,contact.con_address,'hello world')}">
                            <div class="nowrap">${contactDatarow.con_type} [${contactDatarow.con_method}]</div>
                            <div class="jr flexGap">
                                <div class="jr">${contactDatarow.con_address}</div>
                                <span class="jc lightAccentBorder border borderRadius lhSquare">
                                    <span class="${primaryContact ? `accentText` : `transparent`}">&#9673;</span>
                                </span>
                            </div>
                        </a>
                    `;
                }).join('')}
                <button><span class="flexGap"><span>+</span><div>Add New Method Of Contact</div></span></button>
            </div>
        `;
    }
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}

