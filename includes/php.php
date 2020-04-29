<?php

//~ phpFuncs
//~ primary (keep order - secondary funtions use primary functions)
include('php/functions/php_initSettings.php');
//~ secondary
include('php/functions/php_db.php');
include('php/functions/php_document.php');
include('php/functions/php_errorLog.php');
include('php/functions/php_headTags.php');
include('php/functions/php_user.php');


//~ classes
//~ include('/includes/classes');
include('php/classes/class_defaultObject.php');
include('php/classes/class_defaultListObject.php');
include('php/classes/class_user.php');

?>
