<?php
require_once('../includes/php.php');

$nav = (isset($_REQUEST['nav']) ? $_REQUEST['nav'] : '');
//~ echo $nav;

switch($nav){
	case 'submitLogin':
		$usr = new user();
		echo $usr->submitLogin();
	break;

	case 'submitLogout':
		$usr = new user(getUserId());
		echo $usr->submitLogout();
	break;
	
	case 'logUserOut':
		$usr = new user(getUserId());
		echo $usr->submitLogout();
	break;
}
?>
