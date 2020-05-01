//~ async function fetchWinObjects(winObjectType){
    //~ if(devVerbose){console.error('fetchWinObjects() is currently not set up to fetch data from server-side');}
    //~ return getWinDbObjects(winObjectType);
    //~ return win_db_projects;
//~ }
async function fetchWinObjects(winObjectType){
    if(devVerbose){console.error('fetchWinObjects() is currently not set up to fetch data from server-side');}
    return window[`win_db_${winObjectType}`];
}


async function updateWinDbObjects(winObjectType){
    winDbObjects = await fetchWinObjects(winObjectType);
    window[`win_db_${winObjectType}`] = fetchWinObjects(winObjectType);
}
