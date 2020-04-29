<?php
//~ page functions return html

function getHeadTags($title=''){
global $projectLabel;
return '
<meta name="description" content="This is a generic project that can be used as a starting point for all future projects">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>'.$projectLabel.' | '.$title .'</title>'."\n"
.getJs()
.getCss();
}

function getCss(){
	ob_start();
	include('includes/css.php');
	$contents = ob_get_contents();
	ob_end_clean();
	return $contents;
}

function getJs(){
	ob_start();
	include('includes/js.php');
	$contents = ob_get_contents();
	ob_end_clean();
	return $contents;
}

?>
