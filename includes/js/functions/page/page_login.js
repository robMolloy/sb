function getLoginHtml(params={}){
	let container = issetReturn(()=> params.container, true);
	let useGet = issetReturn(()=> params.useGet, false);
	
	let json = issetReturn(()=>params.json,{});
	json = useGet ? getJsonFromGetArray() : json;
	json = initJson(json);
	
	return `${container 
				? `<div class="panel singlePanel singleColumn" id="loginForm">`
				: ``
			}
				<h1 class="alignCenter">Log In</h1>
				${isset(()=>json.errors['0']) ? json.errors[0].map((error)=>`<p>${error}</p>`).join('') : ``}
				${isset(()=>json.errors['usr_email']) ? json.errors.usr_email.map((error)=>`<p>${error}</p>`).join('') : ``}
				<input type="text" name="usr_email" placeholder="Email" value="${isset(()=>json.datarow.usr_email) ? json.datarow.usr_email : ''}">
				
				${isset(()=>json.errors.usr_password)? json.errors.usr_password.map((error)=>`<p>${error}</p>`).join(''): ``}
				<input type="password" name="usr_password" placeholder="Password" value="${isset(()=>json.datarow.usr_password) ? json.datarow.usr_password : ''}">
				
				<div class="alignCenter"><button name="submitLogin" onclick="submitLogin();">Log In!</button></div>
			${container ? '</div>' : ''}`;
}

function loadLoginHtml(params={}){
    clearMain();
	appendToMain(getLoginHtml(params));
}

async function submitLogin(){
	let currentFile = getCurrentFilename();
	
	let file = 'nav/login.nav.php?nav=submitLogin';
	let f = getElementValues({'getValuesFrom':'loginForm'});
	
	let response = await ajax({'file':file,'f':f});
	json = initJson(response);
	
	let datarow = json.datarow;
	let success = (!json.valid || !json.exists ? false : true);
	let printTo = initElement('loginForm');
	
	if(success){goto('index.php');}
	else{printTo.innerHTML = getLoginHtml({'json':json,'container':false});}
	
}

async function logout(){
    if(dev){console.error('logout function not written yet');}
    let response = initJson(await ajax({'file':'nav/login.nav.php?nav=logout'}));
    if(response==true){window.location.href='index.php';}
}
