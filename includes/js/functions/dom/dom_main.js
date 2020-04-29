function appendToMain(html){
	document.querySelector('main').insertAdjacentHTML('beforeend',html);
}

function appendNthInMain(position,html){
	let itemsInMain = document.querySelectorAll('main > *');
	position = position=='' || position=='first' ? 0 : position;
	position = position>=itemsInMain.length ? 'last' : position;
	
	if(position=='last'){appendToMain(html);}
	else{itemsInMain[position].insertAdjacentHTML('beforeBegin',html);}
}

function appendPanelInMain(txt){
    appendToMain(`<div class="panel">${txt}</div>`)
}

function clearMain(){
	document.querySelector('main').innerHTML = '';
}
