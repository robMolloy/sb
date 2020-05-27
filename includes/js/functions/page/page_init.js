async function initPage(page=''){
    //create idb connection - to be used in get/put actions
    idb = await openIndexedDB();
    
    //should only be run on first load - will overwrite edited datarows
    if(dev){await populateIdbWithSampleData();}
    
    //stores all datarows from idb in window[`idb_${tableName}`]
    await initDbVars();
    
    //initialises list objects; allProjects = new Projects() etc.
    initWinObjects();
    
    //initialises winVars
    initWinVars();
    //~ initSecondaryWinVars()
    
    //~ load page
    initDom(page);
}


//~ openIndexedDB() is in aux_indexedDb.js


async function populateIdbWithSampleData(){
    for(winVar of primaryWinVars){
        let tableName = `${winVar}s`;
        for(datarow of Object.values(window[`win_${tableName}_sampleData`])){
            await addDatarow(tableName,datarow);
        }
    }

    return new Promise(resolve=>resolve(true));
}


async function initDbVars(){
    for(winVar of primaryWinVars){
        let tableName = `${winVar}s`;
        window[`idb_${tableName}`] = await getAllDatarows(tableName);
    }
    return new Promise(resolve=>resolve(true));
}


//~ initWinObjects() is in page_winObjects.js
//~ initWinVars() is in page_winVars.js


function initDom(page=''){
    page = page=='' ? getPage() : page;
    page = page=='' ? page = 'index.php' : page;
    pageName = page.split('.')[0];
    refreshDom(pageName);
}
