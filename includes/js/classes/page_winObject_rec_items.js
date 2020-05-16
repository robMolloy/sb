class rec_item extends winObject{
    static getWinObjectType(){
        return 'rec_items';
    }
    
    static getFormPanelHtml(rec_item){
        let labelRow = win_info['rec_items']['labels'];
        //~ {rci_id:'Id',rci_temp_id:'Id',rec_usr_id:'User Id',rci_rec_id:'Record Id',rci_work:'Type Of Work',
        //~ rci_unit:'Unit',rci_qty:'Quantity',rci_cost_per_unit:'Cost per Unit'}
        return `
            <div class="panel form">
                ${select(`
                    <select placeholder="${labelRow.rci_rec_id}" name="rci_rec_id" checks="isNotBlank" >
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
                        placeholder="${labelRow.rci_work}" name="rci_work" checks="isNotBlank" 
                    >`
                    ,
                    Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_work'))
                )}
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>rec_item.rci_unit,'')}"
                        placeholder="${labelRow.rci_unit}" name="rci_unit" checks="isNotBlank" 
                    >`
                    ,
                    Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_unit'))
                )}
                <div class="flexGap">
                    <span class="lhSquare jc borderBottom borderTop">£</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_cost_per_unit,'0.00')}" class="flex1"
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_cost_per_unit}" name="rci_cost_per_unit" checks="isNotBlank" 
                    >`)}
                    <span class="lhSquare jc borderBottom borderTop padSmall">x</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_qty,'1')}" class="flex1" 
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_qty}" name="rci_qty" checks="isNotBlank" 
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
                    <button onclick="rec_item.addObjectFromAnyElementInForm(this);">Save rec_item</button>
                </div>
            </div>
        `;
    }
    
    static getLinkFormHtml(rec_item){
        console.log(rec_item);
        let labelRow = win_info['rec_items']['labels'];
        return `
            <div class="form">
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>rec_item.rci_work,'')}"
                        placeholder="${labelRow.rci_work}" name="rci_work" checks="isNotBlank" 
                    >`
                    ,
                    win_work
                )}
                ${inputSelect(
                    `<input 
                        type="text" value="${issetReturn(()=>rec_item.rci_unit,'')}"
                        placeholder="${labelRow.rci_unit}" name="rci_unit" checks="isNotBlank" 
                    >`
                    ,
                    win_units
                )}
                <div class="flexGap">
                    <span class="lhSquare jc borderBottom borderTop padSmall">£</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_cost_per_unit,'0.00')}" class="flex1"
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_cost_per_unit}" name="rci_cost_per_unit" checks="isNotBlank" 
                    >`)}
                    <span class="lhSquare jc borderBottom borderTop padSmall">x</span>
                    ${input(`<input 
                        type="number" value="${issetReturn(()=>rec_item.rci_qty,'1')}" class="flex1" 
                        oninput="updateInputOnFormWithNameRci_total(this);" step="0.01"
                        placeholder="${labelRow.rci_qty}" name="rci_qty" checks="isNotBlank" 
                    >`)}
                </div>
                <div>
                    <span class="borderBottom borderTop lh padSmall flexGap">
                        <span class="lightText">Total</span>
                        <span class="lightText">|</span>
                        <span class="jr" name="rci_price">
                            <input class="tar width3Lh" type="text" name="rci_total" value="${price(issetReturn(()=>rec_item.rci_total,'0.00'))}" readonly>
                        </span>
                    </span>
                </div>
            </div>
        `;
    }

    static getSummaryLine(recItemRow){
        return `${recItemRow.rci_work}: ${recItemRow.rci_qty}${recItemRow.rci_unit} x ${price(recItemRow.rci_cost_per_unit)} = ${price(recItemRow.rci_total)}`;
    }
    
    static getRecItemDefaultDatarowFromProjectId(projectId){
        let projectDatarow = win_projects[projectId];
        let recItemDatarow = win_info['rec_items']['blank'];
        
        recItemDatarow['rci_work'] = projectDatarow['prj_default_work'];
        recItemDatarow['rci_qty'] = projectDatarow['prj_default_qty'];
        recItemDatarow['rci_unit'] = projectDatarow['prj_default_unit'];
        recItemDatarow['rci_cost_per_unit'] = projectDatarow['prj_rate_per_default_unit'];
        recItemDatarow['rci_total'] = recItemDatarow['rci_qty'] * recItemDatarow['rci_cost_per_unit'];
        
        return recItemDatarow;
    }
    
    static getRecItemDurationDatarowFromProjectId(projectId){
        let projectDatarow = win_projects[projectId];
        let recItemDatarow = win_info['rec_items']['blank'];
        console.log(projectDatarow);
        
        recItemDatarow['rci_work'] = projectDatarow['prj_default_work'];
        recItemDatarow['rci_qty'] = projectDatarow['prj_default_duration_qty'];
        recItemDatarow['rci_unit'] = projectDatarow['prj_default_duration_unit'];
        recItemDatarow['rci_cost_per_unit'] = projectDatarow['prj_default_cost_per_duration_unit'];
        recItemDatarow['rci_total'] = 
            parseFloat(recItemDatarow['rci_qty']) * parseFloat(recItemDatarow['rci_cost_per_unit']);
        
        console.log(recItemDatarow);
        return recItemDatarow;
    }
    
}
