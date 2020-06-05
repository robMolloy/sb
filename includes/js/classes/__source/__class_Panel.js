class Panel{
    initPanel(datarow=''){
        this.datarow = datarow;
        
        this.inforow = win_info[this.winObjectType];
        
        /* should not need these - assume datarow is correct ??? */
        /*
        this.datarow = datarow=='' ? this.datarow : datarow;
        this.datarow = this.datarow ? this.datarow : this.inforow['blankrow'];
        */ 
        /* should not need these - assume datarow is correct ??? */

        
        this.labelrow = this.inforow['labelrow'];
        this.blankrow = this.inforow['blankrow'];
        this.keys = this.inforow['keys'];
        
        this.objectId = this.datarow[this.keys['primary']];
        this.id = this.objectId=='' ? this.idPrefix : `${this.idPrefix}_${this.objectId}`;
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
