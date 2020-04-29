
class record extends winObject{
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
                    ${project.getSelect('',`placeholder="${labelRow.rec_prj_id}" name="rec_prj_id" checks="isNotBlank"`)}
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
                
                <div class="jr"><span class="button" onclick="record.addObjectFromAnyElementInForm(this);">Save Record</span></div>
            </div>
        `;
    }
    
    static getSummaryLine(record){
        let prjRow = win_projects[record.rec_prj_id];
        return `${prjRow.prj_acronym}: ${formatTimestampToDate(record.rec_timestamp_planned_start)}: ${record.rec_description}`;
    }
}







