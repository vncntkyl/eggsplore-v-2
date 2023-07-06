<?php
require_once 'authController.php';
class Locations extends Controller
{

    function retrieve_locations($id = "all")
    {
        try {
            $statement = "SELECT * FROM ep_locations ";
            if ($id !== "all") {
                $statement .= "WHERE location_id = ?";
            }
            $this->setStatement($statement);
            if ($id !== "all") {
                $this->statement->execute([$id]);
                return $this->statement->fetch();
            } else {
                $this->statement->execute();
                return $this->statement->fetchAll();
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function add_location($location_name)
    {
        try {
            $this->setStatement("INSERT INTO ep_locations (location_name) VALUES (?)");
            return $this->statement->execute([$location_name]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_location($loc)
    {
        try {
            $this->setStatement("UPDATE ep_locations SET location_name = ? WHERE location_id = ?");
            return $this->statement->execute([$loc->location_name, $loc->location_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function delete_location($location_id)
    {
        try {
            $this->setStatement("DELETE FROM ep_locations WHERE location_id = ?");
            return $this->statement->execute([$location_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
?>