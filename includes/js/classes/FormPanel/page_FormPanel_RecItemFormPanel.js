class RecItemFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.winObjectType = 'rec_item';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    
    getHtml(){
        let labelrow = this.labelrow;
        return `
            ${select(`
                <select placeholder="${labelrow.rci_rec_id}" name="rci_rec_id" checks="isNotBlank" >
                    <option value="">None</option>
                    ${Object.values(win_records).map((rec)=>{
                        let prjRow = win_projects[rec.rec_prj_id];
                        return `
                            <option value="${rec.rec_id}" ${rec.rec_id==issetReturn(()=>rec_item.rci_rec_id,'') ? `selected="selected"` : ``}>
                                ${prjRow.prj_acronym}: ${formatTimestampToDate(rec.rec_timestamp_planned_start)}: ${rec.rec_description}
                            </option>
                        `;
                    }).join('')}
                </select>
            `)}
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>rec_item.rci_work,'')}"
                    placeholder="${labelrow.rci_work}" name="rci_work" checks="isNotBlank" 
                >`
                ,
                Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_work'))
            )}
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>rec_item.rci_unit,'')}"
                    placeholder="${labelrow.rci_unit}" name="rci_unit" checks="isNotBlank" 
                >`
                ,
                Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_unit'))
            )}
            <div class="flexGap">
                <span class="lhSquare jc borderBottom borderTop">£</span>
                ${input(`<input 
                    type="number" value="${issetReturn(()=>rec_item.rci_cost_per_unit,'0.00')}" class="flex1"
                    oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                    placeholder="${labelrow.rci_cost_per_unit}" name="rci_cost_per_unit" checks="isNotBlank" 
                >`)}
                <span class="lhSquare jc borderBottom borderTop padSmall">x</span>
                ${input(`<input 
                    type="number" value="${issetReturn(()=>rec_item.rci_qty,'1')}" class="flex1" 
                    oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                    placeholder="${labelrow.rci_qty}" name="rci_qty" checks="isNotBlank" 
                >`)}
            </div>
            <div>
                <span class="borderBottom borderTop lh padSmall flexGap">
                    <span class="lightText">Total</span>
                    <span class="lightText">|</span>
                    <span class="jr" name="rci_price">
                        <input class="tar width3Lh" type="text" name="rci_total" value="${price('')}" readonly>
                    </span>
                </span>
                <span class="flex1"></span>
                <button onclick="new RecItem.addUsingFormChild(this);">Save rec_item</button>
            </div>
        `;
    }
}
