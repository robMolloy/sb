class DisplayPanel extends Panel{
    constructor(){
        super();
    }
    
    initDisplayPanel(datarow=''){
        this.idPrefix = 'DisplayPanel';
        this.defaultPosition = 'last';

        this.initPanel(datarow);
        return this;
    }
    
    getHtml(datarow=''){
        datarow = datarow=='' ? this.datarow : datarow;
        let labelrow = this.labelrow;
        
        return `
            <div class="panel singleColumn">
                ${Object.keys(datarow).map(key=>{
                    return `
                        <div>
                            <div style="flex:1">${labelrow[key]}</div>
                            <div style="flex:2">${datarow[key]}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}

