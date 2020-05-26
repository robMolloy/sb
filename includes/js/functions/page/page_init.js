async function initPage(page=''){
    //create idb connection - to be used in get/put actions
    idb = await openIndexedDB();
    
    //should only be run on first load - will overwrite edited datarows
    if(dev){await populateIdbWithSampleData();}
    
    //stores all datarows from idb in window[`idb_${tableName}`]
    await initDbVars();
    
    //initialises list objects; allProjects = new Projects() etc.
    initObjects();
    
    //initialises winVars
    initWinVars();
    //~ initSecondaryWinVars()
    
    //~ load page
    initDom(page);
}

function initObjects(){
    allCustomers   = '';
    allContacts    = '';
    allProjects    = new Projects();
    allRecords     = '';
    allPrjCusLinks = '';
    allRecItems    = '';
}

function initDom(page=''){
    page = page=='' ? getPage() : page;
    page = page=='' ? page = 'index.php' : page;
    pageName = page.split('.')[0];
    refreshDom(pageName);
}



async function initDbVars(){
    for(winVar of getPrimaryWinVars()){
        let tableName = `${winVar}s`;
        window[`idb_${tableName}`] = await getAllDatarows(tableName);
    }
    return new Promise(resolve=>resolve(true));
}


async function populateIdbWithSampleData(){
    for(winVar of getPrimaryWinVars()){
        let tableName = `${winVar}s`;
        for(datarow of Object.values(window[`win_${tableName}_sampleData`])){
            await addDatarow(tableName,datarow);
        }
    }

    return new Promise(resolve=>resolve(true));
}
