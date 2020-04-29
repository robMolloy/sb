<?php
//~ changes mode to developer mode
global $dev;
global $debug;
global $projectLabel;
global $projectName;

$dev = True;
$debug = False;
$projectLabel = 'Self Billing';
$projectName = 'sb';
		
// Turn off error reporting
error_reporting(1);
error_reporting(E_ALL); // Error engine - always TRUE!
ini_set('display_errors', 0); // Error display - FALSE only in production environment or real server
ini_set('log_errors', TRUE); // Error logging engine
ini_set('error_log', '/var/log/apache2/error.log'); // Logging file path

//~ session must start before any other code is run
session_start();


?>
