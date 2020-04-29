<?php
function notice($notice){
    $type = gettype($notice);
    $count = is_array($notice) || is_object($notice) ? count($notice) : 1;
    $noticeString = ($type=='string' ? $notice : json_encode($notice));
    $noticeString = str_replace(['<',   ','],['&lt', ', '],$noticeString);
    
    return '<div>'.strtoupper($type).($count>1 ? ' ['.$count.']' : '').': <br>'.$noticeString.'</div>';
}

?>
