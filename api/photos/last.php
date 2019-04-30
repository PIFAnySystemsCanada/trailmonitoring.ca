<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../shared/utilities.php';
include_once '../objects/photos.php';

try
{
    // get posted data
    $data_string = file_get_contents("php://input");
    $required = ['api_key', 'camera_id', 'count'];
    $data = validate_data($data_string, $required);
    check_api_key($data);

    if (($data->count < -1) || (($data->count > 50)))
    {
        throw new DataException("Count value is not valid");
    }
    if (($data->camera_id < -1) || (($data->camera_id > 10)))
    {
        throw new DataException("Camera Id value is not valid");
    }
    
    // instantiate database and photos object
    $database = new Database();
    $db = $database->getConnection();
    
    // initialize object
    $photos = new Photos($db);
    
    // read photoss will be here
    // query photoss
    $stmt = $photos->readlast($data->camera_id, $data->count);
    $num = $stmt->rowCount();
    
    // check if more than 0 record found
    if($num == 0)
    {
        throw new DataException("No photos found");
    }
    
    // photoss array
    $photos_array=array();
    $photos_array["records"]=array();

    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $photos_item=array(
            "id" => $id,
            "camera_id" => $camera_id,
            "filename" => $filename,
            "directory" => $directory,
            "createtime" => $createtime,
            "deleted" => filter_var($deleted, FILTER_VALIDATE_BOOLEAN ),
            "data" => $data
        );
        array_push($photos_array["records"], $photos_item);
    }
    success_data($photos_array);
}
catch (DataException $e)
{
    failure($e->getMessage(), 404);
}
catch (APIKeyException $e)
{
    failure($e->getMessage(), 401);
}
catch (Exception $e)
{
    failure($e->getMessage(), 400);
}
