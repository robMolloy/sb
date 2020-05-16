<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="height=device-height width=device-width initial-scale=1">
    <link rel="stylesheet" href="includes/css.css">
    <style type="text/css"></style>
    
    <script type="text/javascript" src="includes/js.js"></script>
    <script>
    win_info = {
        employee:{
            labelrow:{emp_id:'id',emp_name:'emp_name',emp_age:'emp_age',job:'job',emp_height_qty:'height',emp_height_unit:'unit'},
            blankrow:{emp_id:'',emp_name:'',emp_age:'',job:'',emp_height_qty:'',emp_height_unit:''}
        }
    }
    
    win_employeeRows = {
        1:{emp_id:1,emp_name:'rob',emp_age:28,job:'Gardening',emp_height_qty:180,emp_height_unit:'cm'},
        2:{emp_id:2,emp_name:'Jake',emp_age:28,job:'Consoultant',emp_height_qty:160,emp_height_unit:'cm'},
        3:{emp_id:3,emp_name:'Judy',emp_age:60,job:'Hr',emp_height_qty:100,emp_height_unit:'cm'}
    }
    
    
    class win_employeeObject{
        constructor(employeeIdentifier=''){
            this.objectType == 'employee';
            this.init(employeeIdentifier);
        }
        
        init(uniqueIdentifier=''){
            this.displayPanel = this.displayPanel ? this.displayPanel : false;
            this.formPanel = this.formPanel ? this.formPanel : false;
            this.blankrow = win_info['employee']['blankrow'];
            
            this.datarow = typeof(uniqueIdentifier)=='object' ? uniqueIdentifier : {emp_id:uniqueIdentifier};
            this.id = this.datarow['emp_id'];
            this.exists = win_employeeRows[this.id] !== undefined;
            
            this.populateDatarow(uniqueIdentifier);
            return this;
        }
         
        populateDatarow(datarow=''){
            datarow = datarow=='' ? this.datarow : datarow;
            datarow = typeof(datarow)=='object' ? datarow : this.blankrow;
            
            let newDatarow = {};
            let templateDatarow = this.exists ? win_employeeRows[datarow['emp_id']] : this.blankrow;
            
            Object.keys(templateDatarow).forEach(key=>{
                newDatarow[key] = datarow[key]===undefined ? templateDatarow[key] : datarow[key];
            });
            
            this.datarow = newDatarow;
            return this.datarow;
        }
        
        renderFormPanel(){
            if(this.formPanel===false){this.formPanel = new win_employeeFormPanel(this.datarow);}
            this.formPanel.update();
        }
        
        
    }
    
    
    class Panel{
        init(datarow=''){
            this.datarow = datarow=='' ? this.datarow : datarow;
            this.id = datarow[this.primaryKey]=='' ? this.idPrefix : `${this.idPrefix}_${datarow[this.primaryKey]}`;
            this.element = document.getElementById(this.id);
            this.render();
        }
        
        update(){
            this.element.innerHTML = this.getHtml();
        }
        
        toggleVisiblity(){
            let hidden = this.element.classList.toggle('hidden');
            this.visible = !hidden;
            return this.visible;
        }
        
        
        render(position=''){
            if(this.element!==null){this.update();return;}
            position = position=='' ? this.defaultPosition : position;
            
            appendNthInMain(position,`<div id="${this.id}" class="panel ${this.defaultClasses.join(' ')}"></div>`);
            this.element = document.getElementById(this.id);
            
            this.update();
            this.visible = true;
        }
        
        getHtml(){}
    }
    
    
    class win_employee_DisplayPanel extends Panel{
        constructor(datarow=''){
            super(datarow);
            
            this.primaryKey = 'emp_id';
            this.idPrefix = 'displayPanel';
            this.defaultPosition = 'last';
            this.defaultClasses = [];
            
            this.datarow = datarow=='' ? win_info['employee']['blankrow'] : datarow;
            this.labelrow = win_info['employee']['labelrow'];
            
            this.init();
        }
        
        getHtml(){
            return `
                <div>${this.labelrow[`emp_id`]}: ${this.datarow[`emp_id`]}</div>
                <div>${this.labelrow[`emp_name`]}: ${this.datarow[`emp_name`]}</div>
                <div>${this.labelrow[`emp_age`]}: ${this.datarow[`emp_age`]}</div>
                <div>${this.labelrow[`emp_height_qty`]}: ${this.datarow[`emp_height_qty`]}</div>
                <div>${this.labelrow[`emp_height_unit`]}: ${this.datarow[`emp_height_unit`]}</div>
            `;
        }
    }
    
    class win_employee_FormPanel extends Panel{
        constructor(datarow=''){
            super(datarow);
            
            this.primaryKey = 'emp_id';
            this.idPrefix = 'formPanel';
            this.defaultPosition = 0;
            this.defaultClasses = [];
            
            this.datarow = datarow=='' ? win_info['employee']['blankrow'] : datarow;
            this.labelrow = win_info['employee']['labelrow'];
            
            this.init();
        }
        
        getHtml(){
            return `
                <div>${wrapInputElement(
                    `<input type="text" name="emp_id" value="${this.datarow[`emp_id`]}" placeholder="${this.labelrow[`emp_id`]}">`
                )}</div>
                <div>${wrapInputElement(
                    `<input type="text" name="emp_name" value="${this.datarow[`emp_name`]}" placeholder="${this.labelrow[`emp_name`]}">`
                )}</div>
                <div>${wrapInputElement(
                    `<input type="text" name="emp_age" value="${this.datarow[`emp_age`]}" placeholder="${this.labelrow[`emp_age`]}">`
                )}</div>
                <div>${wrapInputElement(
                    `<input type="text" name="emp_height_qty" value="${this.datarow[`emp_height_qty`]}" placeholder="${this.labelrow[`emp_height_qty`]}">`
                )}</div>
                <div>${wrapInputElement(
                    `<input type="text" name="emp_height_unit" value="${this.datarow[`emp_height_unit`]}" placeholder="${this.labelrow[`emp_height_unit`]}">`
                )}</div>
                <div onclick="console.log(${this});">test!</div>
            `;
        }
    }
    

    win_employeeObjects = {};
    Object.values(win_employeeRows).forEach(datarow=>win_employeeObjects[datarow['emp_id']] = new win_employeeObject(datarow));
    
    </script>
</head>

<body onload="">
    <div class="wrapperMain" id="wrapperMain">
        <main>
            _
        </main>
    </div>
    <div id="responseLogIcon" onclick="toggleResponseLog()"></div>
</body>
