function appendToMain(html){
	//~ appendNthInMain('last',html);
    html = typeof(html)=='string' ? html : getHtmlStringFromElement(html);
    document.querySelector('main').insertAdjacentHTML('beforeend',html);
}

function appendNthInMain(position,html){
	position = position=='' || position=='first' ? 0 : position;
    html = typeof(html)=='string' ? html : getHtmlStringFromElement(html);
    
    let itemsInMain = document.querySelectorAll('main > *');
	if(itemsInMain.length==0 || position=='last' || position>=itemsInMain.length){appendToMain(html);return;}
    
	itemsInMain[position].insertAdjacentHTML('beforeBegin',html);
}

function appendPanelInMain(html){
    appendToMain(`<div class="panel">${html}</div>`)
}

function clearMain(){
	document.querySelector('main').innerHTML = '';
}
