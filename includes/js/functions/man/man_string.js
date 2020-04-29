function ucFirst(str1){
	return str1.charAt(0).toUpperCase() + str1.slice(1);
}

function ucFirstOfEachWord(str){
	return str.split(' ').map((val)=>ucFirst(val)).join(' ');
}

function formatStringForTitle(str){
	return ucFirstOfEachWord(str.replace(/-/g, " "));
}

function formatString(str){
	return `${str.replace(/-/g, " ")}`;
}

function escapeHtmlTags(str){
	return str.replace(new RegExp('<', 'g'), '&lt');
}

function price(num,currency='£'){
    num = num=='' ? 0 : num;
    return `${currency}${parseFloat(num).toFixed(2)}`;
}

function randomString(length=5){
    return Math.random().toString(36).substr(2,length);
}

function tempIdString(){
    return `temp_${win_user['usr_id']}_${getCurrentTime()}_${randomString(5)}`;
}

