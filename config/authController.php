<?php
require 'db-config.php';
class Controller
{
    public $connection;
    public $statement;
    public $isConnectionSuccess;
    public $connectionError;
    function __construct()
    {
        try {
            $dsn = "mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME;

            $this->connection = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->isConnectionSuccess = true;
        } catch (PDOException $e) {
            $this->connectionError = "<script defer> console.log('" . $e->getMessage() . "')</script>";
        }
    }
    function setStatement($query)
    {
        if ($this->isConnectionSuccess) {
            $this->statement = $this->connection->prepare($query);
        } else {
            echo "Server Down!!!";
        }
    }
    function getError($e)
    {
        echo "An exception occurred: " . $e->getMessage();
        echo "Error code: " . $e->getCode();
        echo "File: " . $e->getFile();
        echo "Line: " . $e->getLine();
    }
}
?>