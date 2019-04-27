<?php
include_once "../config/core.php";

class Database
{
    public $conn;
 
    // get the database connection. Throws a PDOException on error.
    public function getConnection()
    {
        global $db_host;
        global $db_name;
        global $db_user;
        global $db_pass;

        $this->conn = null;
 
        $this->conn = new PDO("mysql:host=" . $db_host . ";dbname=" . $db_name, $db_user, $db_pass);
        $this->conn->exec("set names utf8");

        return $this->conn;
    }
}
?>
