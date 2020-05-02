    //~ static get(key,ifnull=null){
    //~ static getAll(){
    //~ static set(key,item){
    //~ static remove(key){
    //~ static addItems(key,items){
    //~ static addItem(key,item){

class mightyStorage {
    static get(key,ifnull=null){
        let lsItem = localStorage.getItem(key);
        return lsItem===null ? ifnull : JSON.parse(lsItem);
    }
    
    static getWithKey(key){
        let rtn = {};
        rtn[key] = this.get(key);
        return rtn;
        
    }
    
    static getAll(){
        let newCache = {};
        Object.keys(localStorage).forEach(key=>newCache[key] = this.get(key));
        return newCache;
    }
    
    static removeAll(){
        Object.keys(localStorage).forEach(key=>this.remove(key));
    }
    
    static after(key=''){
        return key=='' ? this.getAll() : this.getWithKey(key);
    }
    
    static set(key,item){
        localStorage.setItem(key,JSON.stringify(item));
        return this.after(key);
    }
    
    static remove(key){
        localStorage.removeItem(key);
        return this.after(key);
    }

    static addItems(key,items){
        let cacheArray = this.get(key,[]);
        return this.set(key,[...items,...cacheArray]);
    }
    
    static addItem(key,item){
        item = [item];
        return this.addItems(key,item);
    }
    
    static addObjectsToObjectOfObjects(key,objects){
        //~ must be in format {5:{'cus_id':5,'cus_usr_id':4,...},18:{...},28:{...},...}
        if(!isObjectOfObjects(objects)){console.error(`This is not an object of objects: ${JSON.stringify(objects)}`);return false;}
        
        let cacheObjects = getFromCache(key,{});
        return this.set(key,mergeTwoIndexedObjects(cacheObjects,objects))
    }
    
    static addObjectToObjectOfObjects(key,object,index){
        //~ must be in format {'cus_id':5,'cus_usr_id':4,...}
        let indexValue = object[index];
        let newObject = {};
        newObject[indexValue] = object;
        return this.addObjectsToObjectOfObjects(key,newObject);
    }
    
    static addObject(key,object,index=''){
        if(index==''){return this.addItem(key,object);}
        else{return this.addObjectToObjectOfObjects(key,object,index);}
    }
    
    static addObjects(key,objects){
        if(isArrayOfObjects(objects)){return this.addItems(key,objects);}
        else{return this.addObjectsToObjectOfObjects(key,objects);}
    }
}


function getFromCache(key,ifnull=null){
    let lsItem = localStorage.getItem(key);
    lsItem = isJson(lsItem) ? JSON.parse(lsItem) : lsItem;
    return lsItem===null ? ifnull : lsItem;
}

function setToCache(key,value){
    localStorage.setItem(key,typeof(value)=='string' ? value : JSON.stringify(value));
}

function removeFromCache(key){
    localStorage.removeItem(key);
}

function addObjectsToArrayInCache(key,objects){
    objects = Array.isArray(objects) ? objects : [objects];
    
    let cacheArray = getFromCache(key,[]);
    setToCache(key,[...objects,...cacheArray]);
}

function addObjectsToObjectsInCache(key,objects){
    //~ must be in format {1:{},7:{},312:{}}
    
    objects = isWinObject(objects) ? convertObjectToObjectOfObjects(objects,key) : objects;
    
    let cacheObjects = getFromCache(key,{});
    setToCache(key,mergeTwoIndexedObjects(cacheObjects,objects));
}

function addObjectToObjectsInCache(key,object){
    //~ must be in format {'cus_id':5,'cus_usr_id':4...}
    
    let primaryKey = win_keys[key]['primary'];
    let primaryKeyValue = object[primaryKey];
    object = {primaryKeyValue:object};
    addObjectsToObjectsInCache(key,object);
}


