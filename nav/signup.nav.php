<?php
require_once('../includes/php.php');

$nav = (isset($_REQUEST['nav']) ? $_REQUEST['nav'] : '');

switch($nav){
	case 'submitSignup':
		$usr = new user();
		echo $usr->submitSignup();
	break;
}
?>
