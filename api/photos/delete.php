<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/photos.php';
include_once '../shared/utilities.php'; 
 
try
{
    $data_string = file_get_contents("php://input");
    $required = ['api_key', 'id'];
    $data = validate_data($data_string, $required);
    check_api_key($data);

    $database = new Database();
    $db = $database->getConnection();
    $photos = new photos($db);

    // set photos id to be deleted
    $photos->id = $data->id;
    
    // delete the photos
    if(!$photos->delete())
    {
        throw new DataException("unable to delete photo");
    
    }
    success("photo marked as deleted");
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