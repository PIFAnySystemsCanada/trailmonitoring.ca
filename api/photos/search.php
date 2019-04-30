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
include_once '../objects/photos.php';
include_once '../shared/utilities.php';

try
{
    // get posted data (hides the API key better than a get)
    $data_string = file_get_contents("php://input");
    $required = ['api_key', 'keywords'];
    $data = validate_data($data_string, $required);
    check_api_key($data);

    // instantiate database and photos object
    $database = new Database();
    $db = $database->getConnection();
    $photos = new Photos($db);
    
    if (!$data->keywords)
    {
        throw new InvalidArgumentException("keywords token is required");
    }
    // query  
    $stmt = $photos->search($data->keywords);
    $num = $stmt->rowCount();
    
    // check if more than 0 record found
    if($num < 1)
    {
        throw new DataException("No photos found");
    }
    
    // photos array
    $photos_arr=array();
    $photos_arr["records"]=array();

    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);

        $photos_item=array(
            "id" => $id,
            "camera_id" => html_entity_decode($camera_id), 
            "filename" => html_entity_decode($filename),
            "directory" => html_entity_decode($directory),
            "createtime" => $createtime,
            "deleted" => filter_var($deleted, FILTER_VALIDATE_BOOLEAN ),
            "data" => $data,
        );

        array_push($photos_arr["records"], $photos_item);
    }
    success_data($photos_arr);
}
catch (DataException $e)
{
    failure($e->getMessage(), 404);
}
catch (InvalidArgumentException $e)
{
    failure($e->getMessage(), 412);
}
catch (APIKeyException $e)
{
    failure($e->getMessage(), 401);
}
catch (PDOException $e)
{
    failure("Database connection error: " . $e->getMessage(), 500);
}
catch (Exception $e)
{
    failure($e->getMessage(), 400);
}
?>
