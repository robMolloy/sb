<?php
function getDocumentHtml(){
return '
<!DOCTYPE html>
<html>
'.getHeadHtml().'
'.getBodyHtml().'
</html>
';
}


function getBodyHtml(){
return '
<body onload="initPage();">
<header></header>

<div id="content">
    <div class="wrapperMain" id="wrapperMain">
        <main>
        </main>
    </div>
    
    <div id="responseLogIcon" onclick="toggleResponseLog();"></div>
</div>

<footer><a href="http://romolo.co.uk/">romolo.co.uk</a></footer>
</body>
';
}


function getHeadHtml($page=''){
return '
<head>
'.getHeadTags($page).'
</head>
';
}
?>
