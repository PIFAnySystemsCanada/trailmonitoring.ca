<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/photos.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare photos object
$photos = new photos($db);
 
// set ID property of record to read
if (isset($_GET['id']))
{
    $photos->id = $_GET['id'];
}
else
{
    // set response code - 412 Precondition failed
    http_response_code(412);
    // tell the user photos does not exist
    echo json_encode(array("message" => "id is required"));
    die();
}
 
// read the details of photos to be edited
$photos->readOne();
 
if (!empty($photos->filename))
{
    // create array
    $photos_arr = array(
        "id" =>  $photos->id,
        "filename" => $photos->filename,
        "directory" => $photos->directory,
        "createtime" => $photos->createtime,
        "deleted" => filter_var($photos->deleted, FILTER_VALIDATE_BOOLEAN ),
        "data" => $photos->data,
    );
 
    // set response code - 200 OK
    http_response_code(200);
 
    // make it json format
    echo json_encode($photos_arr);
}
 
else{
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user photos does not exist
    echo json_encode(array("message" => "Photo does not exist."));
}
?>
