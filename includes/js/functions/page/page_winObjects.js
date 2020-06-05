function initWinObjects(){
    allCustomers   = new Customers();
    allContacts    = new Contacts();
    allPrjCusLinks = new PrjCusLinks();
    allProjects    = new Projects();
    allRecords     = new Records();
    allRecItems    = new RecItems();
}


function refreshWinObjects(){
    //~ allProjects.refresh();
    allCustomers.refresh();
    allContacts.refresh();   
    allPrjCusLinks.refresh();
    allProjects.refresh();
    allRecords.refresh();
    allRecItems.refresh();
}
