function refreshDom(pageName=''){
    pageName = pageName=='' ? currentPageName : pageName;
    currentPageName = pageName;
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
