String.prototype.toDate = function(){return new Date(this.valueOf());}

String.prototype.toggleSuffix = function(suffix){
    if(this.slice(-suffix.length)==suffix){return this.slice(0,-suffix.length);} else {return `${this}${suffix}`;}
}

