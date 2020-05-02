function initPage(page=''){
    page = page=='' ? getPage() : page;
    if(page=='' && dev){window.location.href = 'index.php';return;}
    pageName = page.split('.')[0];
    switch(pageName){
        case 'index':displayHeaderBar('');appendToMain(`<div class="panel">At Index.php</div>`);break;
        case 'customers':customer.loadPage();break;
        case 'contacts':contact.loadPage();break;
        case 'projects':project.loadPage();break;
        case 'records':record.loadPage();break;
        case 'prj_cus_links':prj_cus_link.loadPage();break;
        case 'rec_items':rec_item.loadPage();break;
    }
}


