const primaryWinVars = ['project','customer','prj_cus_link','contact','record','rec_item'];
const secondaryWinVars = ['win_customersGroupedByPrj_id','win_contactsGroupedByCus_id','win_recordsGroupedByPrj_id','win_rec_itemsGroupedByRec_id','win_units','win_work'];


function initWinVars(){
    refreshWinVars();
}


function refreshWinVars(){
    refreshPrimaryWinVars();
    refreshSecondaryWinVars();
}

function refreshPrimaryWinVar(winObjectType){
    let keys = win_info[winObjectType].keys;
    let idbDatarows = window[`idb_${winObjectType}s`];
    let storedDatarows = mightyStorage.get(`${winObjectType}s`,{});
    let deletedDatarows = mightyStorage.get(`deleted_${winObjectType}s`,{});
    
    tempDatarows = mergeTwoIndexedObjects(idbDatarows,storedDatarows);
    
    Object.values(deletedDatarows).forEach((datarow)=>{
        delete tempDatarows[datarow[keys.primary]];
        delete tempDatarows[datarow[keys.temp]];
    });
    
    window[`win_${winObjectType}s`] = tempDatarows;
}

function refreshPrimaryWinVars(){
    primaryWinVars.forEach(winObjectType=>{
        refreshPrimaryWinVar(winObjectType)
    });
    
    // allContacts.refresh();
    // allCustomers.refresh();
    // allPrjCusLinks.refresh();
    // allProjects.refresh();
    // allRecItems.refresh();
    // allRecords.refresh();
}


function refreshSecondaryWinVars(){
    win_customersGroupedByPrj_id = indexObjectsUsingLinkObjects('prj_cus_link','project','customer');
    win_contactsGroupedByCus_id = groupAnObjectOfObjectsByIndex(win_contacts,'con_cus_id'); 
    win_recordsGroupedByPrj_id = groupAnObjectOfObjectsByIndex(win_records,'rec_prj_id'); 
    win_rec_itemsGroupedByRec_id = groupAnObjectOfObjectsByIndex(win_rec_items,'rci_rec_id'); 
    win_units = [...win_time_units,...Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_unit')),...Object.keys(indexAnObjectOfObjects(win_projects,'prj_default_unit'))];
    win_work = [...Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_work')),...Object.keys(indexAnObjectOfObjects(win_projects,'prj_default_work'))];
}
