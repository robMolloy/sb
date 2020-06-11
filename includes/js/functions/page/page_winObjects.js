function initWinObjects(){
    templateCustomer   = new Customer();
    templateContact    = new Contact();
    templatePrjCusLink = new PrjCusLink();
    templateProject    = new Project();
    templateRecord     = new Record();
    templateRecItem    = new RecItem();

    allCustomers   = new Customers();
    allContacts    = new Contacts();
    allPrjCusLinks = new PrjCusLinks();
    allProjects    = new Projects();
    allRecords     = new Records();
    allRecItems    = new RecItems();
}


function refreshWinObjects(){
    allCustomers.refresh();
    allContacts.refresh();   
    allPrjCusLinks.refresh();
    allProjects.refresh();
    allRecords.refresh();
    allRecItems.refresh();
}
