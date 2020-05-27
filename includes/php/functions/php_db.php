<?php
	
function openDb(){
    $dbCreds = dbCreds((True ? 'local' : 'server'));
	$dbConn = new mysqli($dbCreds['host'],$dbCreds['dbUser'],$dbCreds['password'],$dbCreds['database']);

	if($dbConn->connect_error){
		die("Database Connection Error, Error No.: ".$dbConn->connect_errno." | ".$dbConn->connect_error);
		return;
	} else {
		return $dbConn;
	}
}


function dbCreds($case='local'){
    //~ Is this a safe approach?
    //~ It depends on your definition of safe.
    //~ every developer can see the database connection details
    switch($case){
        case 'local':
        return ["host"=>"localhost","dbUser"=>"rob","password"=>"robberrydb","database"=>"conConDB"];	
        
        case 'server':
        return ["host"=>"db766738431.hosting-data.io","dbUser"=>"dbo766738431","password"=>"qAa5GZhhEF4Z4MOk7DWJ!","database"=>"db766738431"];
    }
}


function getEmptyTableRow($tableName,$tablePrimaryKey){
	$db = openDb();
	$sql = "SELECT * ,IFNULL(max(".$tablePrimaryKey."),'') as thisid FROM ".$tableName." GROUP BY ".$tablePrimaryKey." LIMIT 1;";
	$stmt = $db->prepare($sql);
	$stmt->execute();
	 
	$result = $stmt->get_result();
	$row = $result->fetch_assoc();
	
	unset($row['thisid']);
	foreach($row as $k=>$v){$row[$k] = '';}
	
	$db->close();
	return $row;
}


function getTableRowUsingId($tableName,$tablePrimaryKey,$id){
	$db = openDb();
	$stmt = $db->prepare("SELECT * FROM ".$tableName." WHERE ".$tablePrimaryKey."=? LIMIT 1;");
	$stmt = bindParameters($stmt,$id);
	$stmt->execute();
	
	$result = $stmt->get_result();
	$db->close(); 
	
	if($result->num_rows==1){
		return $result->fetch_assoc();
	} else {
		return False;
	}
}


function bindParameters($stmt,$originalArray=[]){
	if(is_array($originalArray) && count($originalArray)==0){return $stmt;}
	
    $originalArray = (gettype($originalArray)=='string' || gettype($originalArray)=='integer' ? [$originalArray] : $originalArray);
	$newArray = [];
	
    foreach($originalArray as $k=>$v){$newArray[] = $v;}
    
	$string = str_repeat('s',count($newArray));
    switch(count($newArray)){
        case 0:$stmt->bind_param($string);break;
        case 1:$stmt->bind_param($string,$newArray[0]);break;
        case 2:$stmt->bind_param($string,$newArray[0],$newArray[1]);break;
        case 3:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2]);break;
        case 4:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3]);break;
        case 5:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4]);break;
        case 6:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5]);break;
        case 7:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6]);break;
        case 8:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7]);break;
        case 9:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8]);break;
        case 10:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9]);break;
        case 11:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10]);break;
        case 12:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11]);break;
        case 13:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12]);break;
        case 14:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12],$newArray[13]);break;
        case 15:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12],$newArray[13],$newArray[14]);break;
        case 16:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12],$newArray[13],$newArray[14],$newArray[15]);break;
        case 17:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12],$newArray[13],$newArray[14],$newArray[15],$newArray[16]);break;
        case 18:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12],$newArray[13],$newArray[14],$newArray[15],$newArray[16],$newArray[17]);break;
        case 19:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12],$newArray[13],$newArray[14],$newArray[15],$newArray[16],$newArray[17],$newArray[18]);break;
        case 20:$stmt->bind_param($string,$newArray[0],$newArray[1],$newArray[2],$newArray[3],$newArray[4],$newArray[5],$newArray[6],$newArray[7],$newArray[8],$newArray[9],$newArray[10],$newArray[11],$newArray[12],$newArray[13],$newArray[14],$newArray[15],$newArray[16],$newArray[17],$newArray[18],$newArray[19]);break;
    }
        
	return $stmt;
}


function prepareAndBind($db,$sql,$datarow){
    $stmt = $db->prepare($sql);
    if(substr_count($sql,'?')==count($datarow)){
		$stmt = bindParameters($stmt,$datarow);
	} else {
		trigger_error('<div>SQL ERROR:<br>"'.$sql.'" ['.implode(',',$datarow).']<br><br>Datarow'.json_encode($datarow).'</div>');
	}
    global $debug; if($debug){logResolveStatement($sql, $datarow);}
    return $stmt;
}


function logResolveStatement($sql, $datarow){
	$resstmt = [];
	$resSqlArray = [];
	$datarowValues = array_values($datarow);
	
	$i = 0;
	foreach(str_split($sql) as $k=>$v){
		$resSqlArray[] = $v=='?' ? "'".$datarowValues[$i]."'" : $v;
		if($v=='?'){$i++;}
	}
	
	$resstmt = ['sql'=>$sql, 'datarow'=>$datarow, 'resolved_statement'=>implode('',$resSqlArray)];
	trigger_error(notice($resstmt));
}


?>
