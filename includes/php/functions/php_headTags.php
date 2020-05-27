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
    .getCss()
    .getJs()
    .getJsVars();
}

function getCss(){
    global $dev;
	if($dev){updateCss();}
	$contents = returnOutputOfPhpFile('includes/css.php');
	return '<link rel="stylesheet" href="includes/css/icons/css/all.css">'
            ."\n".'<style type="text/css">'.$contents.'</style>';
}

function updateCss(){
	$contents = returnOutputOfPhpFile('includes/css.php');
    $contents = str_replace('includes/','',$contents);
    file_put_contents('includes/css.css',$contents);
}

function updateJsVars(){
	$contents = returnOutputOfPhpFile('includes/jsVars.php');
    file_put_contents('includes/jsVars.js',$contents);
}

function getJs(){
    global $dev;
	if($dev){updateJs();}
    $contents = returnOutputOfPhpFile('includes/js.php');
	return $contents;
}

function updateJs(){
    $contentsArr = [];
    $files = [];
    
    //~ $files = array_merge($files,findFilePathsInDirectory('includes/js/classes/'));
    $files = array_merge($files,findFilePathsInDirectory('includes/js/extend/'));
    $files = array_merge($files,findFilesInDirectoriesInParentDirectory('includes/js/classes/'));
    $files = array_merge($files,findFilesInDirectoriesInParentDirectory('includes/js/functions/'));
    
    /*
    $classesDirectories = findDirectoryPathsInDirectory('includes/js/classes/');
    forEach($classesDirectories as $classDir){$files = array_merge($files,findFilePathsInDirectory($classDir.'/'));}
    
    $functionsDirectories = findDirectoryPathsInDirectory('includes/js/functions/');
    forEach($functionsDirectories as $funcDir){$files = array_merge($files,findFilePathsInDirectory($funcDir.'/'));}
    forEach($files as $file){$contentsArr[] = file_get_contents($file);}
    */
    
    //~ trigger_error(notice($files));
    
    forEach($files as $file){$contentsArr[] = file_get_contents($file);}
    file_put_contents('includes/js.js',implode("\n",$contentsArr));
}

function getJsVars(){
    global $dev;
	if($dev){updateJsVars();}
    $contents = returnOutputOfPhpFile('includes/jsVars.php');
	return '<script>'.$contents.'</script>';
}

function returnOutputOfPhpFile($file){
    ob_start();
	include($file);
	$contents = ob_get_contents();
	ob_end_clean();
    return $contents;
}

function customSortArray($arr){
    natcasesort($arr);
    $arr = array_values($arr);
    krsort($arr);

    return array_values($arr);
}

function findFilesInDirectoriesInParentDirectory($parentDir){
    $files = [];
    $directoriesInParent = findDirectoryPathsInDirectory($parentDir);
    $directoriesInParent = customSortArray($directoriesInParent);
    forEach($directoriesInParent as $dirs){
        $files = array_merge($files,findFilePathsInDirectory($dirs.'/'));
    }
    return $files;
}

function findFilePathsInDirectory($dir){
    return array_filter(glob($dir.'*'), 'is_file');
}

function findDirectoryPathsInDirectory($dir){
    return array_filter(glob($dir.'*'), 'is_dir');
}

?>
