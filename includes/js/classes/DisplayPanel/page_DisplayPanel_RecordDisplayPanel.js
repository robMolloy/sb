class RecordDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'record';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    getHtml(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        let itemsOnRecord = issetReturn(()=>win_rec_itemsGroupedByRec_id[record.rec_id],{});
        return `
            <div class="panel singleColumn">
                <div class="fw600 grid12">
                    <div class="fw600 gs8">${record.rec_description}</div>
                    <div class="fw600 gs4 jr">${price(record.rec_total)}</div>
                </div>
                <span onclick="toggleClassOnNextElement(this,'hidden');" class="click">
                    <div>Items (${Object.keys(itemsOnRecord).length} on project) &#9660;</div>
                </span>
                <div class="singleColumn gridGapSmall hidden">
                    <span class="button">Add New Item +</span>
                    ${Object.values(itemsOnRecord).map((item)=>`${rec_item.getSummaryLine(item)}`).join('')}
                </div>
            </div>
        `;
    }
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}

