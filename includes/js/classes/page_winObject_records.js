
class record extends WinObject{
    static getWinObjectType(){
        return 'records';
    }
    
    static getPanelHtml(record){
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
    
    static getFormPanelHtml(record){
        let labelRow = win_info['records']['labels'];
        return `
            <div class="panel form">
                ${wrapSelectElement(`
                    ${project.getSelect('',`
                        placeholder="${labelRow.rec_prj_id}" name="rec_prj_id" checks="isNotBlank" 
                        oninput="record.updateFormWithProjectDetails(this,this.value);"
                    `)}
                `)}
                
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>record.rec_description,'')}"
                        placeholder="${labelRow.rec_description}" name="rec_description" checks="isNotBlank" 
                    >`
                    ,Object.keys(indexAnObjectOfObjects(win_records,'rec_description'))
                    ,''
                )}
                
                ${dateInput(`<input 
                    value="${issetReturn(()=>record.rec_timestamp_planned_start,'')}" checks="isNotBlank" 
                    placeholder="${labelRow.rec_timestamp_planned_start}" name="rec_timestamp_planned_start"
                >`)}
                <div class="flexGap">
                    ${wrapInputElement(`<input type="number" value="${issetReturn(()=>record.rec_duration_qty,'1')}" 
                        name="rec_duration_qty" placeholder="${labelRow.rec_duration_qty}" 
                        checks="isInt_positive" class="width2Lh"
                    >`)}
                    ${wrapSelectElement(
                        `<select 
                            type="text" value="${issetReturn(()=>record.rec_duration_unit,'hour')}"
                            placeholder="${labelRow.rec_duration_unit}" name="rec_duration_unit" 
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
            </div>
        `;
    }
    
    static addFormsInForm(forms,addedObject=''){
        let datarowArray = Array.from(forms).map((form)=>{
            let datarow = rec_item.getFromForm(form);
            datarow['rci_rec_id'] = issetReturn(()=>addedObject['rec_id'],'');
            return datarow;
        });
        datarowArray.forEach(datarow=>rec_item.addObject(datarow));
    }
    
    static getSummaryLine(record){
        let prjRow = win_projects[record.rec_prj_id];
        return `${prjRow.prj_acronym}: ${formatTimestampToDate(record.rec_timestamp_planned_start)}: ${record.rec_description}`;
    }
    
    static updateFormWithProjectDetails(formChild,projectId){
        let form = formChild.classList.contains('form') ? formChild : getParentElementWithClass(formChild,'form');
        let project = win_projects[projectId];
        form.querySelector(`[name=rec_duration_qty]`).value = project['prj_default_duration_qty'];
        form.querySelector(`[name=rec_duration_unit]`).value = project['prj_default_duration_unit'];
    }
}







