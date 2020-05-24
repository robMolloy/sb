class Panel{
    initPanel(datarow=''){
        this.datarow = datarow=='' ? this.datarow : datarow;
        this.datarow = this.datarow ? this.datarow : win_info[this.winObjectType]['blankrow'];
        
        this.labelrow = win_info[this.winObjectType]['labelrow'];
        this.primaryKey = win_info[this.winObjectType]['keys']['primary'];

        this.objectId = this.datarow[this.primaryKey];
        this.id = datarow[this.primaryKey]=='' ? this.idPrefix : `${this.idPrefix}_${this.datarow[this.primaryKey]}`;
        //~ this.create();
        
        return this;
    }
    
    update(){
        this.element.innerHTML = this.getHtml();
    }
    
    toggleVisiblity(){
        let hidden = this.element.classList.toggle('hidden');
        this.visible = !hidden;
        return this.visible;
    }
    
    show(){
        this.element.classList.remove('hidden');
    }
    
    hide(){
        this.element.classList.add('hidden');
    }
    
    create(){
        if(!this.element){
            this.element = convertHtmlStringToElement(`<div id="${this.id}" class="panel ${this.defaultClasses.join(' ')}"></div>`);
            this.update();
        }
    }
    
    render(position=''){
        this.create();
        position = position=='' ? this.defaultPosition : position;
        appendNthInMain(position,this.element);
        
        this.show();
        this.visible = true;
    }
    
    getHtml(){}
}
