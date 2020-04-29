<?php
require_once('../includes/php.php');

$nav = (isset($_REQUEST['nav']) ? $_REQUEST['nav'] : '');


switch($nav){
	case 'getUserObject':
		$usr = new user(getUserId());
		echo $usr->sendJson();
	break;

	case 'userIsLoggedIn':
		echo userIsLoggedIn();
	break;
    
	case 'getUserFirstName':
		echo getUserFirstName();
	break;
    
	case 'getUserLastName':
		echo getUserLastName();
	break;
    
	case 'getUserEmail':
		echo getUserEmail();
	break;
    
	case 'getUserId':
		echo getUserId();
	break;
}
?>
