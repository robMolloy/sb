function displayHeaderBar(page=''){
	document.querySelector('header').innerHTML = getHeaderBarHtml();
	highlightHeaderTab(page);
}

function getHeaderBarHtml(){
    return `${getHeaderTabsHtml()}${getHeaderSettingsHtml()}`;
}

function getHeaderTabsHtml(){
    let fileType = getUrl().split('.').slice(-1).join();
    return `<span id="tabs">
                ${win_pages.map((page)=>`
                    <a  class="tab" id="tab_${page}" ${fileType=='php' ? `href="${page}.php"` : `onclick="${page.slice(0,-1)}.loadPage();"`}>${formatStringForTitle(page)}</a>
                `).join('')}
            </span>`;
}

function getHeaderSettingsHtml(){
    return `<span id="settings">${win_loggedIn ? `` : `<a onclick="loadLoginHtml()">Log In</a>`}</span>`;
}

function highlightHeaderTab(page=''){
	document.querySelectorAll('.tab').forEach((tab)=>{
		if(tab.id == `tab_${page}`){tab.classList.add('highlight');}
		else {tab.classList.remove('highlight');}
	});
}
