function refreshDom(pageName=''){
    pageName = pageName=='' ? currentPageName : pageName;
    currentPageName = pageName;
    switch(pageName){
        case 'index':displayHeaderBar('');appendToMain(`<div class="panel singlePanel">At Index.php</div>`);break;
        case 'contacts':    allContacts.loadPage();break;
        case 'customers':   allCustomers.loadPage();break;
        case 'prj_cus_links':allPrjCusLinks.loadPage();break;
        case 'projects':    allProjects.loadPage();break;
        case 'records':     allRecords.loadPage();break;
        case 'rec_items':   allRecItems.loadPage();break;
    }
}
