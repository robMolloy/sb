//~ fetches data from the server incliudes refreshWinVars
async function initWinVars(winVar){
    await initPrimaryWinVars();
    initSecondaryWinVars();
}

function initPrimaryWinVars(){
    getPrimaryWinVars().forEach(async (winVar)=>await initPrimaryWinVar(winVar));
    refreshPrimaryWinVars();
}

function initSecondaryWinVars(){
    refreshSecondaryWinVars();
}

//~ manipulates cache(localStorage) and winDbVar data to get refresh winVars
function refreshWinVars(){
    refreshPrimaryWinVars();
    refreshSecondaryWinVars();
}

function refreshPrimaryWinVars(){
    getPrimaryWinVars().forEach(winVar=>refreshPrimaryWinVar(winVar));
}

function refreshSecondaryWinVars(){
    getSecondaryWinVars().forEach(winVar=>initSecondaryWinVar(winVar));
}
