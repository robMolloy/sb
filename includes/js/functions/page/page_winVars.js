
function getPrimaryWinVars(){
    return ['win_projects','win_customers','win_prj_cus_links','win_contacts','win_records','win_rec_items'];
}

function getSecondaryWinVars(){
    //~ return ['win_customersGroupedByPrj_id','win_customersIndexedByCus_id','win_contactsIndexedByCon_id','win_contactsGroupedByCus_id','win_recordsGroupedByPrj_id','win_rec_itemsGroupedByRec_id'];
    return ['win_customersGroupedByPrj_id','win_contactsGroupedByCus_id','win_recordsGroupedByPrj_id','win_rec_itemsGroupedByRec_id','win_units','win_work'];
}

async function initPrimaryWinVar(winVar){
    if(devVerbose && online()){
        switch(winVar){
            case 'win_loggedIn': win_loggedIn = await userIsLoggedIn(); break;
            case 'win_pages': break;
            case 'win_projects': win_projects = await fetchProjects(); break;
            case 'win_customers': win_customers = await fetchCustomers(); break;
            case 'win_prj_cus_links': win_prj_cus_links = await fetchPrjCusLinks(); break;
            case 'win_contacts': win_contacts = await fetchContacts(); break;
            default:console.error(`${winVar} cannot be initiated, case does not exist in initWinVar()`);
        }
    }
}

async function initSecondaryWinVar(winVar){
    switch(winVar){
        case 'win_customersGroupedByPrj_id': win_customersGroupedByPrj_id = getCustomersGroupedByPrj_id(); break;
        case 'win_contactsGroupedByCus_id': win_contactsGroupedByCus_id = groupAnObjectOfObjectsByIndex(win_contacts,'con_cus_id'); break;
        case 'win_recordsGroupedByPrj_id': win_recordsGroupedByPrj_id = groupAnObjectOfObjectsByIndex(win_records,'rec_prj_id'); break;
        case 'win_rec_itemsGroupedByRec_id': win_rec_itemsGroupedByRec_id = groupAnObjectOfObjectsByIndex(win_rec_items,'rci_rec_id'); break;
        case 'win_units': win_units = [...win_time_units,...Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_unit')),...Object.keys(indexAnObjectOfObjects(win_projects,'prj_default_unit'))];break;
        case 'win_work': win_work = [...Object.keys(indexAnObjectOfObjects(win_rec_items,'rci_work')),...Object.keys(indexAnObjectOfObjects(win_projects,'prj_default_work'))];break;
        
        default:console.error(`${winVar} cannot be initiated, case does not exist in initWinVar()`);
    }
}

function refreshPrimaryWinVar(winVar){
    switch(winVar){
        case 'win_projects':        project.initObjects();break;
        case 'win_customers':       customer.initObjects();break;
        case 'win_prj_cus_links':   win_prj_cus_links = mergeTwoIndexedObjects(win_db_prj_cus_links,mightyStorage.get('win_prj_cus_links',{}));break;
        case 'win_contacts':        win_contacts = mergeTwoIndexedObjects(win_db_contacts,mightyStorage.get('win_contacts',{}));break;
        case 'win_rec_items':       win_rec_items = mergeTwoIndexedObjects(win_db_rec_items,mightyStorage.get('win_rec_items',{}));break;
        case 'win_records':         record.initObjects();break;
        
        default:console.error(`${winVar} cannot be refreshed, case does not exist in refreshWinVar()`);
    }
}

function getCustomersGroupedByPrj_id(){
    let customer = {};let cus_id = 0;
    let project = {};let prj_id = 0;
    let prj_idIndexedCustomers= {};
    let cusLinksOnProject = {};
    
    let cusLinksOnProjects = groupAnObjectOfObjectsByIndex(win_prj_cus_links,'prj_cus_link_prj_id');
    
    Object.keys(win_projects).forEach((prjKey)=>{
        project = win_projects[prjKey];
        prj_id = project.prj_id;
        prj_idIndexedCustomers[prj_id] = {};
        
        cusLinksOnProject = issetReturn(()=>cusLinksOnProjects[prj_id],{});
        Object.keys(cusLinksOnProject).forEach((cusLinkKey)=>{
            cus_id = cusLinksOnProject[cusLinkKey].prj_cus_link_cus_id;
            customer = win_customers[cus_id];
            prj_idIndexedCustomers[prj_id][cus_id] = customer;
        });
    });
    return prj_idIndexedCustomers;
}
