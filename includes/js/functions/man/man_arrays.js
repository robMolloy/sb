function searchArrayOfObjects(arr,index,value){
    let arr2 = [];
    arr.forEach((item)=>{
        if(item[index]==value){
            arr2.push(item);
        }
    });
    return arr2;
}

//~ function only used if index is unique, returns {1:{...},2:{...},3:{...}}
function indexAnArrayOfObjects(arr,index){
    let obj = {};
    arr.forEach((item)=>obj[item[index]] = item);
    return obj;
}

//~ group in arrays - used where index is not unique - returns {1:[4:{},5:{}...],2:[...],3:[...]}
function groupAnArrayOfObjectsByIndex(arr,index){
    let obj = {};
    arr.forEach((item)=>obj[item[index]] = []);
    arr.forEach((item)=>obj[item[index]].push(item));
    return obj;
}
