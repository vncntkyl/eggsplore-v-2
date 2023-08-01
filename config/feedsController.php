<?php
require_once 'authController.php';
class Feeds extends Controller
{
    function retrieve_feeds($id = "all")
    {
        try {
            $statement = $id === "all" ? "SELECT * FROM ep_feeds" : "SELECT * FROM ep_feeds WHERE id = ?"; 
            $this->setStatement($statement);
            if($id !== "all"){
                $this->statement->execute([$id]);
                return $this->statement->fetch();
            }else{
                $this->statement->execute();
                return $this->statement->fetchAll();
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function addFeeds($name, $description)
    {
        try {
            $this->setStatement("INSERT INTO ep_feeds (name, description) VALUES (?,?)");
            return $this->statement->execute([$name, $description]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateFeeds($feeds)
    {
        try {
            $this->setStatement("UPDATE ep_feeds SET name = ?, description = ? WHERE id = ?");
            return $this->statement->execute([$feeds->name, $feeds->description, $feeds->id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteFeeds($feeds_id)
    {
        try {
            $this->setStatement("DELETE FROM ep_feeds WHERE id = ?");
            return $this->statement->execute([$feeds_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieve_feeds_inventory(){
        
    }
}
