<?php
class defaultListObject {
    public $datarows = [];
    //~ public $objects = [];
    public $sensitivedatarow = [];
    public $labelrow = [];
    public $table = ['name'=>'','label'=>'','primarykey'=>'','userkey'=>''];
    public $order = '';
    public $finalString = '';
    public $direction = 'DESC';
    public $defaultFilters = [];
    public $filters = [];
    public $defaultJoins = [];
    public $joins = [];
    
    function __construct($order='',$direction='',$filters='',$joins='',$finalString=''){
        $this->init($order,$direction,$filters,$joins,$finalString);
    }
    
    function init($order='',$direction='',$filters='',$joins='',$finalString=''){
        $this->order = ($order=='' ? $this->order : $order);
        $this->direction = ($direction=='' ? $this->direction : $direction);
        $this->filters = ($filters=='' ? $this->filters : $filters);
        $this->joins = ($joins=='' ? $this->joins : $joins);
        $this->finalString = ($finalString=='' ? $this->finalString : $finalString);
        
        $this->initFilters($filters);
        $this->initJoins($filters);
        
        $this->sqlString = $this->getSqlString();
        $this->sqlParams = $this->getSqlParams();
        
        $this->datarows = $this->getDatarows();
        
    }
    
    function setDefaultFilters(){
        //~ default value = [] 
        $this->defaultFilters = [];
    }
    
    function initJoins($joins=''){
        //~ pass ''(any string) or noissue get $this->filters
        $joins = (!is_string($joins) ? $this->joins : $joins);
        
        //~ pass blank array clears filters (except default filters)
        $joins = ($joins!=[] ? $this->joins : $joins);
        
        $this->setDefaultJoins();
        //~ default filters
        foreach($this->defaultJoins as $operator=>$array){
            foreach($array as $column=>$value){
                $joins[$operator][$column] = $value;
            }
        }
        $this->joins = $joins;
    }
    
    function setDefaultJoins(){
        //~ possible value = ['onb_organisationRequests'=>['usr_id'=>'orq_usr_id']] 
        //~ default value = [] 
        $this->defaultJoins = [];
    }
    
    function initFilters($filters=''){
        //~ pass ''(any string) or noissue get $this->filters
        $filters = (!is_string($filters) ? $this->filters : $filters);
        
        //~ pass blank array clears filters (except default filters)
        $filters = ($filters!=[] ? $this->filters : $filters);
        
        $this->setDefaultFilters();
        //~ default filters
        foreach($this->defaultFilters as $operator=>$array){
            foreach($array as $column=>$value){
                $filters[$operator][$column] = $value;
            }
        }
        $this->filters = $filters;
    }
    
    function getSqlString(){
        $whereArray = [];
        foreach($this->filters as $operator=>$array){
            foreach($array as $column=>$value){
                $whereArray[] = $column.$operator.'?';
            }
        }
        $joinArray = [];
        foreach($this->joins as $table=>$array){
            reset($array);
            $firstKey = key($array);
            $firstValue = $array[$firstKey];
            $joinArray[] = "INNER JOIN ".$table." ON ".$firstKey."=".$firstValue;
        }
		
		
        $sql = "SELECT * FROM ".$this->table['name']
                    .(count($joinArray)==0 ? "" : " ".implode(' ',$joinArray))
                    .(count($whereArray)==0 ? "" : " WHERE ".implode(' AND ', $whereArray))
                    .($this->order=='' ? "" : " ORDER BY ".$this->order." ".$this->direction)
                    .($this->finalString=='' ? '' : ' '.$this->finalString);
        return $sql;
    }
    
    function getSqlParams(){
        $paramsArray=[];
        foreach($this->filters as $operator=>$array){
            foreach($array as $column=>$value){
                $paramsArray[] = $value;
            }
        }
        
        return $paramsArray;
    }
    
    function getDatarows(){
        $datarows = [];
        
        $db = openDb();
        $stmt = $db->prepare($this->sqlString);
        $stmt = bindParameters($stmt,$this->sqlParams);
        $stmt->execute();
        $rcd = $stmt->get_result();
        
        while($row = $rcd->fetch_assoc()){
            $datarows[] = $row;
        }
        
        $db->close();
        return $datarows;
    }
    
    function getSafeDatarows(){
        if(count($this->sensitivedatarow)==0){return $this->datarows;}
        
        $datarows = [];
        foreach($this->datarows as $k1=>$datarow){
            foreach($this->sensitivedatarow as $column=>$value){
                if(isset($datarow[$column])){$datarow[$column] = $value;}
            }
            $datarows[] = $datarow;
        }
        return $datarows;
    }
    
    function getJson(){
		$datarows = $this->getSafeDatarows();
         
		$json = [
                    'labelrow'=>$this->labelrow,
                    'order'=>$this->order,
                    'datarows'=>$datarows,
                    'direction'=>$this->direction,
                    'filters'=>$this->filters
                ];
        return $json;
    }
    
    function sendJson(){
        return json_encode($this->getJson());
    }
}
?>
