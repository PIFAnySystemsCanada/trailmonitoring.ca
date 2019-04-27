<?php

include_once "../config/core.php";

class APIKeyException extends Exception { }
class EmptyDataException extends Exception { }
class DataException extends Exception { }

function check_api_key($data_api_key)
{
    global $api_key;
    if (empty($data_api_key) || ($data_api_key != $api_key))
    {
        throw new APIKeyException("Invalid API Key");
    }
}

function success($message)
{
    http_response_code(200);
    echo json_encode(array("message" => $message, "success" => "true"));
}

function success_data($data)
{
    http_response_code(200);
    echo json_encode(array("data" => $data, "success" => "true"));
}

function created($message)
{
    http_response_code(201);
    echo json_encode(array("message" => $message, "success" => "true"));
}

function failure($message, $code)
{
    http_response_code($code);
    echo json_encode(array("message" => $message, "success" => "false"));
}

?>
