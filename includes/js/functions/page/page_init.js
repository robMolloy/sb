async function initPage(page=''){
    idb = await openIndexedDB();
    if(dev){await populateIdbWithSampleData();}
    await initDbVars();
    
    initObjects();
    refreshWinVars();
    //~ initSecondaryWinVars()
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
    if(page=='' && dev){window.location.href = 'index.php';return;}
    pageName = page.split('.')[0];
    refreshDom(pageName);
}

function refreshDom(pageName){
    switch(pageName){
        case 'index':displayHeaderBar('');appendToMain(`<div class="panel singlePanel">At Index.php</div>`);break;
        case 'customers':customer.loadPage();break;
        case 'contacts':contact.loadPage();break;
        case 'projects':allProjects.loadPage();break;
        case 'records':record.loadPage();break;
        case 'prj_cus_links':prj_cus_link.loadPage();break;
        case 'rec_items':rec_item.loadPage();break;
    }
}


async function initDbVars(){
    for(winVar of getPrimaryWinVars()){
        let tableName = `${winVar}s`;
        window[`win_db_${tableName}`] = await getAllDatarows(tableName);
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
