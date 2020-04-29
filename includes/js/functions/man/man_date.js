//~ ************ Date Functions ***************/



function convertDateStringAndTimeStringToDateObject(dateString,timeString){
    timeString = timeString=='' ? '00' : timeString;
    
    let timeArray = timeString.split(':');
    while(timeArray.length<3){timeArray.push('00');}
    timeString = timeArray.join(':')
    
    return new Date(`${dateString}T${timeString}Z`);
}

function convertDateStringAndTimeStringToTimestamp(dateString,timeString){
    let dt = convertDateStringAndTimeStringToDateObject(dateString,timeString);
    return dt.getTime();
}

function getDateFromDateObject(dt){
    return `
        ${dt.getFullYear()}-${dt.getMonth().toString().padStart(2,`0`)}-${dt.getDate().toString().padStart(2,`0`)}
    `;
}

function getTimeFromDateObject(dt){
    return `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
}

function getTimestampFromDateObject(dt){
    return dt.getTime();
}

function getCurrentTime(){
	return Math.floor(Date.now() / 1000);
}

function formatTimestampToDate(timestamp){
	return new Date(parseInt(timestamp)).toLocaleDateString();
}


/*

function toFormattedDateTime(timestamp){
    timestamp = parseInt(timeStamp)
	let today = new Date(timeStamp).setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
	let t = new Date(timeStamp);
	
	return today ? t.toLocaleTimeString() : t.toLocaleDateString();
    
	//~ var t = new Date(0);
	//~ var t1 = new Date(0);
	//~ t.setSeconds(timestamp);
	//~ t1.setSeconds(timestamp);
	
	//~ var todaysDate = new Date();
	//~ var today = t1.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0);
	
	//~ return today ? t.toLocaleTimeString() : t.toLocaleDateString();
}

function toShortDateTime(timestamp){
	var t = new Date(0);
	t.setSeconds(timestamp);
	return `${t.toLocaleDateString()}  ${t.toLocaleTimeString()}`;
}

function formatTimestampToDateTime(timestamp){
	var t = new Date(0);
	t.setSeconds(timestamp);
	return `${t.toLocaleDateString()}  ${t.toLocaleTimeString()}`;
}

*/
