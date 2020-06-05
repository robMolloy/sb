class RecordFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.winObjectType = 'record';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    
    getHtml(){
        let labelrow = this.labelrow;
        return `
            ${wrapSelectElement(`
                ${allProjects.getSelect('',`
                    placeholder="${labelrow.rec_prj_id}" name="rec_prj_id" checks="isNotBlank" 
                    oninput="record.updateFormWithProjectDetails(this,this.value);"
                `)}
            `)}
            
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>record.rec_description,'')}"
                    placeholder="${labelrow.rec_description}" name="rec_description" checks="isNotBlank" 
                >`
                ,Object.keys(indexAnObjectOfObjects(win_records,'rec_description'))
                ,''
            )}
            
            ${dateInput(`<input 
                value="${issetReturn(()=>record.rec_timestamp_planned_start,'')}" checks="isNotBlank" 
                placeholder="${labelrow.rec_timestamp_planned_start}" name="rec_timestamp_planned_start"
            >`)}
            <div class="flexGap">
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>record.rec_duration_qty,'1')}" 
                    name="rec_duration_qty" placeholder="${labelrow.rec_duration_qty}" 
                    checks="isInt_positive" class="width2Lh"
                >`)}
                ${wrapSelectElement(
                    `<select 
                        type="text" value="${issetReturn(()=>record.rec_duration_unit,'hour')}"
                        placeholder="${labelrow.rec_duration_unit}" name="rec_duration_unit" 
                        checks="isNotBlank" 
                    >
                        ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                    </select>`
                )}
            </div>
            <div>
                <span class="borderBottom borderTop lh padSmall flexGap">
                    <span class="lightText">Total</span>
                    <span class="lightText">|</span>
                    <span class="jr" name="rec_price">
                        <input class="tar width3Lh" type="text" name="rec_total" value="${price('')}" readonly>
                    </span>
                </span>
            </div>                
            <div class="buttonRow flexGap">
                <button onclick="rec_item.appendFormAboveButtonRow(this,rec_item.getRecItemDefaultDatarowFromProjectId(getTargetElementValue(this,'form','[name=rec_prj_id]')));"><span class="flexGap"><span>+</span><div>Add Item</div></span></button>
                <button onclick="rec_item.appendFormAboveButtonRow(this,rec_item.getRecItemDurationDatarowFromProjectId(getTargetElementValue(this,'form','[name=rec_prj_id]')));"><span class="flexGap"><span><i class="far fa-clock"></i></span><div>Add Duration</div></span></button>
                <div class="flex1"></div>
                <button onclick="record.addObjectFromAnyElementInForm(this);">Save Record</button>
            </div>
        `;
    }
}
