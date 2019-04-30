<?php

include_once "../config/core.php";

class APIKeyException extends Exception { }
class EmptyDataException extends Exception { }
class DataException extends Exception { }

function check_api_key($data)
{
    global $api_key;
    if (!array_key_exists('api_key', $data))
    {
        throw new APIKeyException("Missing API Key");
    }

    if (empty($data->api_key) || ($data->api_key != $api_key))
    {
        throw new APIKeyException("Invalid API Key");
    }
}

function validate_data($data_string, $required)
{
    if (empty($data_string))
    {
        throw new DataException("POST data required");
    }
    try
    {
        $data = json_decode($data_string);
    }
    catch(Exception $e)
    {
        throw new DataException("Unable to parse JSON data: " + $data_string);
    }
    foreach ($required as $key)
    {
        if (!array_key_exists($key, $data))
        {
            throw new DataException("POST data requires all keys: $key");
        }
    }
    return $data;
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
