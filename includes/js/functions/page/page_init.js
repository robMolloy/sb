function initPage(page=''){
    page = page=='' ? getPage() : page;
    switch(page){
        case 'index.php':displayHeaderBar('');appendToMain(`<div class="panel">At Index.php</div>`);break;
        case 'customers.php':customer.loadPage();break;
        case 'contacts.php':contact.loadPage();break;
        case 'projects.php':project.loadPage();break;
        case 'records.php':record.loadPage();break;
        case 'prj_cus_links.php':prj_cus_link.loadPage();break;
        case 'rec_items.php':rec_item.loadPage();break;
    }
}

