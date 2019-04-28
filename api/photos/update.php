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
    $data = json_decode(file_get_contents("php://input"));

    check_api_key($data->api_key);

    $database = new Database();
    $db = $database->getConnection();
    $photos = new photos($db);
    
    // set ID property of photos to be edited
    $photos->id = $data->id;
    
    // set photos property values
    $photos->camera_id = $data->camera_id;
    $photos->filename = $data->filename;
    $photos->directory = $data->directory;
    $photos->deleted = $data->deleted;
    $photos->data = $data->data;
    
    // update the photos
    if (!$photos->update())
    {
        throw new DataException("data error: unable to update photo");
    }
    success("photo with id " . $photos->id . " updated");
}
catch (DataException $e)
{
    failure($e->getMessage(), 503);
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
