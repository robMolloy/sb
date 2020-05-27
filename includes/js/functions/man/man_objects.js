function mergeTwoIndexedObjects(obj1,obj2){
    let newObject = obj1;
    Object.keys(obj2).forEach(key=>newObject[key] = obj2[key]);
    return newObject;
}


function convertObjectToObjectOfObjects(object,index){
    let newObject = {};
    newObject[object[index]] = object;
    return newObject;
}


function indexAnObjectOfObjects(objectOfObjects,index){
    let newObject = {};
    Object.keys(objectOfObjects).forEach(key=>{
        let object = objectOfObjects[key];
        let indexValue = object[index];
        newObject[indexValue] = object;
    });
    return newObject;
}


function groupAnObjectOfObjectsByIndex(objectOfObjects,index){
    let newObject = {};
    Object.keys(objectOfObjects).forEach(key=>{
        let object = objectOfObjects[key];
        let indexValue = object[index];
        if(!isset(()=>newObject[indexValue])){newObject[indexValue] = {}};
        newObject[indexValue][key] = object;
    });
    return newObject;
}


function indexObjectsUsingLinkObjects(linkWinObjectType,indexWinObjectType,objectWinObjectType){
    let newObject = {};
    let indexPrimaryKey = win_info[indexWinObjectType][`keys`][`primary`];
    let objectPrimaryKey = win_info[objectWinObjectType][`keys`][`primary`];
    
    Object.keys(window[`win_${indexWinObjectType}s`]).forEach(indexId => newObject[indexId] = {});
    
    Object.values(window[`win_${linkWinObjectType}s`]).forEach(link =>{
        let indexId = link[`${linkWinObjectType}_${indexPrimaryKey}`];
        let objectId = link[`${linkWinObjectType}_${objectPrimaryKey}`];
        newObject[indexId][objectId] = window[`win_${objectWinObjectType}s`][objectId];
    });
    
    return newObject;
}
