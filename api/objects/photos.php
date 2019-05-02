<?php
class Photos{
 
    // database connection and table name
    private $conn;
    private $table_name = "photos";
 
    // object properties
    public $id;
    public $camera_id;
    public $filename;
    public $directory;
    public $createtime;
    public $deleted;
    public $data;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read products
    function read(){
    
        // select all query
        $query = "SELECT
                    p.id, p.camera_id, p.filename, p.createtime, p.deleted, p.data
                FROM
                    " . $this->table_name . " p ";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }

    // create product
    function create(){
    
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    camera_id=:camera_id, filename=:filename, directory=:directory, data=:data, createtime=NOW()";
    
        // prepare query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->camera_id=htmlspecialchars(strip_tags($this->camera_id));
        $this->filename=htmlspecialchars(strip_tags($this->filename));
        $this->directory=htmlspecialchars(strip_tags($this->directory));
        $this->data=htmlspecialchars(strip_tags($this->data));
    
        // bind values
        $stmt->bindParam(":camera_id", $this->camera_id);
        $stmt->bindParam(":filename", $this->filename);
        $stmt->bindParam(":directory", $this->directory);
        $stmt->bindParam(":data", $this->data);
    
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
        
    }

    // used when filling up the update product form
    function readOne()
    {
    
        // query to read single record
        $query = "SELECT
                    p.id, p.camera_id, p.filename, p.directory, p.createtime, p.deleted, p.data
                FROM
                    " . $this->table_name . " p
                WHERE
                    p.id = ?
                LIMIT
                    0,1";
    
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
    
        // bind id of product to be updated
        $stmt->bindParam(1, $this->id);
    
        // execute query
        $stmt->execute();
    
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        // set values to object properties
        $this->camera_id = $row['camera_id'];
        $this->filename = $row['filename'];
        $this->directory = $row['directory'];
        $this->createtime = $row['createtime'];
        $this->deleted = filter_var($row['deleted'], FILTER_VALIDATE_BOOLEAN );
        $this->data = $row['data'];
    }  
    
    // update the product
    function update(){
    
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                camera_id = :camera_id,
                filename = :filename,
                directory = :directory,
                deleted = :deleted,
                data = :data
                WHERE
                    id = :id";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->camera_id=htmlspecialchars(strip_tags($this->camera_id));
        $this->filename=htmlspecialchars(strip_tags($this->filename));
        $this->directory=htmlspecialchars(strip_tags($this->directory));
        $this->deleted=htmlspecialchars(strip_tags($this->deleted));
        $this->data=htmlspecialchars(strip_tags($this->data));
        $this->id=htmlspecialchars(strip_tags($this->id));
    
        if ($this->deleted)
        {
            $this->deleted = '1';
        }
        else
        {
            $this->deleted = '0';
        }

        // bind new values
        $stmt->bindParam(':camera_id', $this->camera_id);
        $stmt->bindParam(':filename', $this->filename);
        $stmt->bindParam(':directory', $this->directory);
        $stmt->bindParam(':deleted', $this->deleted);
        $stmt->bindParam(':data', $this->data);
        $stmt->bindParam(':id', $this->id);
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }    

    // delete the product
    function delete()
    {
    
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                deleted = true
                WHERE
                    id = ?";
    
        // prepare query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
    
        // bind id of record to delete
        $stmt->bindParam(1, $this->id);
    
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
        
    }

    function delete_by_name()
    {
    
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                deleted = true
                WHERE
                    filename = :filename AND directory = :directory";
    
        // prepare query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->filename=htmlspecialchars(strip_tags($this->filename));
        $this->directory=htmlspecialchars(strip_tags($this->directory));
    
        // bind id of record to delete
        $stmt->bindParam(':filename', $this->filename);
        $stmt->bindParam(':directory', $this->directory);
    
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
        
    }


    /**
     * Get a list of files based on the day of the week
     * @param $day - days into the past to return
     * Day number: 
     * 0 - today
     * 1 - yesterday
     * 2 - 2 days ago
     * etc...
     */
    function readlist($camera, $day)
    {
        // Figure out the timestamps
        $date = new DateTime();
        $date_interval = new DateInterval("P". $day . "D");
        $date->sub($date_interval);
        $datestring = $date->format('Y-m-d');
        // select all query
        $query = "SELECT
                    p.id, p.camera_id, p.filename, p.directory, p.createtime, p.deleted, p.data
                FROM
                    " . $this->table_name . " p
                WHERE
                    DATE(p.createtime) = ? AND p.camera_id = ? AND p.deleted = false
                ORDER BY
                    p.createtime ASC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // bind
        $stmt->bindParam(1, $datestring);
        $stmt->bindParam(2, $camera);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }

    /**
     * Get a list of files based on the day of the week
     * @param $day - days into the past to return
     * Day number: 
     * 0 - today
     * 1 - yesterday
     * 2 - 2 days ago
     * etc...
     */
    function readlast($camera, $count)
    {
        // select all query
        $query = "SELECT
                    p.id, p.camera_id, p.filename, p.directory, p.createtime, p.deleted, p.data
                FROM
                    " . $this->table_name . " p
                WHERE
                    p.camera_id = " . $camera . " AND p.deleted = false
                ORDER BY
                    p.createtime DESC
                LIMIT
                    0," . $count;

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();
    
        return $stmt;
    }

    // search products
    function search($keywords){
    
        // select all query
        $query = "SELECT
                    p.id, p.camera_id, p.filename, p.directory, p.createtime, p.deleted, p.data
                FROM
                    " . $this->table_name . " p
                WHERE
                    p.filename LIKE ? OR p.directory LIKE ?
                ORDER BY
                    p.createtime DESC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
    
        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }    
}

