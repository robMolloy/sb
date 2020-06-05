class RecordDisplayPanel extends DisplayPanel{
    constructor(datarow=''){
        super();
        
        this.winObjectType = 'record';
        this.defaultClasses = [];
        this.initDisplayPanel(datarow);
    }
    
    getHtml(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        let itemDatarowsOnRecord = issetReturn(()=>win_rec_itemsGroupedByRec_id[datarow.rec_id],{});
        
        return `
            <div class="fw600 grid12">
                <div class="fw600 gs8">${datarow.rec_description}</div>
                <div class="fw600 gs4 jr">${price(datarow.rec_total)}</div>
            </div>
            <span onclick="toggleClassOnNextElement(this,'hidden');" class="click">
                <div>Items (${Object.keys(itemDatarowsOnRecord).length} on project) &#9660;</div>
            </span>
            <div class="singleColumn gridGapSmall hidden">
                <span class="button">Add New Item +</span>
                ${Object.values(itemDatarowsOnRecord).map((recItemDatarow)=>{
                    return `<div>${RecItemDisplayPanel.getSummaryLine(recItemDatarow)}</div>`;
                }).join('')}
            </div>
        `;
    }
    
    getSummaryLine(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        return `[summary line]`;
    }
}

