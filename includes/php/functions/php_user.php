<?php
	function userIsLoggedIn(){
		global $projectName; 
		if((isset($_SESSION['projectName']) ? $_SESSION['projectName'] : False)==$projectName){
			return (int)(issetReturn($_SESSION['usr_id'],False)) > 0;
		}
	}
	function getUserId(){ return (userIsLoggedIn() ? $_SESSION['usr_id'] : '0'); }
	function getUserFirstName(){ return (userIsLoggedIn() ? $_SESSION['usr_first_name'] : ''); }
	function getUserLastName(){ return (userIsLoggedIn() ? $_SESSION['usr_last_name'] : ''); }
	function getUserEmail(){ return (userIsLoggedIn() ? $_SESSION['usr_email'] : ''); }

?>
