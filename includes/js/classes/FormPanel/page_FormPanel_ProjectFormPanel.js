class ProjectFormPanel extends FormPanel{
    constructor(datarow=''){
        super();
        this.init(datarow);
    }
    
    init(datarow=''){
        this.initProjectFormPanel(datarow);
    }
    
    initProjectFormPanel(datarow=''){
        this.winObjectType = 'project';
        this.defaultClasses = ['panel','formPanel','form'];
        
        this.initFormPanel(datarow);
    }
    
    getHtml(){
        let labelrow = this.labelrow;
        let primaryKey = win_info[this.winObjectType]['keys']['primary']
        let temporaryKey = win_info[this.winObjectType]['keys']['temp']
        
        return `
            <div>Pick a unique reference for this project</div>
            ${wrapInputElement(`<input 
                type="text" value="${issetReturn(()=>this.datarow.prj_acronym,'')}" name="prj_acronym" 
                checks="isNotBlank minChars_3" placeholder="${labelrow.prj_acronym}" 
                oninput="allProjects.ifInputValueIsSameAsProjectAcronymAddError(this);"
            >`)}
            <div>What is the address of this project?</div>
            ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_address_1,'')}" 
                name="prj_address_1" placeholder="${labelrow.prj_address_1}" checks="isNotBlank" 
            >`)}
            ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_address_2,'')}" 
                name="prj_address_2" placeholder="${labelrow.prj_address_2}" 
            >`)}
            <div class="flexGap flexl2r1">
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_city,'')}" 
                    name="prj_city" placeholder="${labelrow.prj_city}" checks="isNotBlank" 
                >`)}
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_postcode,'')}" 
                    name="prj_postcode" placeholder="${labelrow.prj_postcode}" checks="isNotBlank" 
                >`)}
            </div>
            <div>What work is usually done on this project?</div>
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>this.datarow.prj_default_work,'')}"
                    placeholder="${labelrow.prj_default_work}" name="prj_default_work" checks="isNotBlank" 
                >`
                ,win_work
            )}
            <div>What is the default unit of work?</div>
            ${inputSelect(
                `<input 
                    type="text" value="${issetReturn(()=>this.datarow.prj_default_unit,'')}"
                    placeholder="${labelrow.prj_default_unit}" name="prj_default_unit" checks="isNotBlank" 
                >`
                ,win_units
            )}
            <div>How many units of work will usually take place?</div>
            <div class="flexGap">
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_qty,'')}" 
                    name="prj_default_qty" placeholder="${labelrow.prj_default_qty}" checks="isFloat" 
                >`)}
                <div class="formLabel">Units</div>
            </div>
            <div>What is the rate charged per unit of work?</div>
            <div class="flexGap">
                <span class="formLabel">£</span>
                ${wrapInputElement(`<input type="text" value="${issetReturn(()=>this.datarow.prj_rate_per_default_unit,'')}" 
                    name="prj_rate_per_default_unit" placeholder="${labelrow.prj_rate_per_default_unit}" 
                    checks="isFloat"
                >`)}
                <div class="formLabel">Per Unit</div>
            </div>
            <div>How often will the work take place?</div>
            <div class="flexGap">
                <div class="formLabel">Every</div>
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_repeat_every_qty,'1')}" 
                    name="prj_default_repeat_every_qty" placeholder="${labelrow.prj_default_repeat_every_qty}" 
                    checks="isInt_positive" class="width2Lh"
                >`)}
                ${wrapSelectElement(
                    `<select 
                        type="text" value="${issetReturn(()=>this.datarow.prj_default_repeat_every_unit,'')}"
                        placeholder="${labelrow.prj_default_repeat_every_unit}" name="prj_default_repeat_every_unit" checks="isNotBlank" 
                    >
                        ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                    </select>`
                )}
            </div>
            <div class="singleColumn gridGap0">
                <div>What is the usual duration of this work?</div>
                <div class="fs70 jr">(May be the same as the default unit and quantity)</div>
            </div>
            <div class="flexGap">
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_duration_qty,'1')}" 
                    name="prj_default_duration_qty" placeholder="${labelrow.prj_default_duration_qty}" 
                    checks="isInt_positive" class="width2Lh"
                >`)}
                ${wrapSelectElement(
                    `<select 
                        type="text" value="${issetReturn(()=>this.datarow.prj_default_duration_unit,'hour')}"
                        placeholder="${labelrow.prj_default_duration_unit}" name="prj_default_duration_unit" 
                        checks="isNotBlank" 
                    >
                        ${win_time_units.map(unit=>`<option value="${unit}">${ucFirst(unit)}s</option>`).join('')}
                    </select>`
                )}
            </div>
            <div class="singleColumn gridGap0">
                <div>What is the rate charged per unit of time worked?</div>
                <div class="fs70 jr">(Leave as 0 if not paid per unit of time)</div>
            </div>
            <div class="flexGap">                                                     
                <span class="formLabel">£</span>
                ${wrapInputElement(`<input type="number" value="${issetReturn(()=>this.datarow.prj_default_cost_per_duration_unit,'0.00')}" 
                    name="prj_default_cost_per_duration_unit" placeholder="${labelrow.prj_default_cost_per_duration_unit}" 
                    checks="isInt_positive"
                >`)}
                <div class="formLabel">Per Unit</div>
            </div>
            <div class="buttonRow">
                <button onclick="prj_cus_link.appendFormAboveButtonRow(this);"><span class="flexGap"><span>+</span><div>Add Customer</div></span></button>
                <span class="flex1"></span>
                <button onclick="templateProject.addUsingFormChild(this);">Save Project</button>
            </div>
        `;
    }
}
