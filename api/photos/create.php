<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../shared/utilities.php';
 // instantiate photos object
include_once '../objects/photos.php';
 
try
{
    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    check_api_key($data->api_key);

    // make sure data is not empty
    if (
        empty($data->filename) ||
        empty($data->directory)
       )
    {
        throw new EmptyDataException();
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    $photos = new Photos($db);
    
    // set photos property values
    $photos->filename = $data->filename;
    $photos->directory = $data->directory;
    $photos->deleted = false;

    // Check the API Key
    if ($api_key = $data->api_key)
    // create the photos
    if (!$photos->create())
    {
        throw new DataException("Unable to create photos");
    }
    created("photo record was created");
}
catch (DataException $e)
{
    failure($e->getMessage(), 503);
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