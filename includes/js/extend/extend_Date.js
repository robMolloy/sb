Date.prototype.getMyDate = function(){return `
    ${this.getFullYear()}-${(this.getMonth()+1).toString().padStart(2,`0`)}-${this.getDate().toString().padStart(2,`0`)}
`.trim();}

Date.prototype.getMyTime = function(){return `
    ${this.getHours().toString().padStart(2,`0`)}:${this.getMinutes().toString().padStart(2,`0`)}
`.trim();}
