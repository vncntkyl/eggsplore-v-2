<?php
require_once 'authController.php';
class Building extends Controller
{

    function retrieve_buildings($bldg_id = null)
    {
        try {
            $sqlStatement = "SELECT * FROM ep_building";
            if ($bldg_id) {
                $sqlStatement .= " WHERE id = " . $bldg_id;
            }
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            if (!$bldg_id) {
                return $this->statement->fetchAll();
            } else {
                return $this->statement->fetch();
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieve_all_user_buildings()
    {
        try {
            $this->setStatement("SELECT ub.user_id, b.id as building_id, b.number, b.capacity FROM ep_building b JOIN ep_user_building ub ON b.id = ub.building_id ORDER BY ub.building_id ASC");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieve_buildings_by_user_id($user_id)
    {
        try {
            $this->setStatement("SELECT ub.user_id, b.id as building_id, b.number, b.capacity FROM ep_building b JOIN ep_user_building ub ON b.id = ub.building_id WHERE ub.user_id = ? ORDER BY ub.building_id ASC");
            $this->statement->execute([$user_id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function addBuilding($name, $capacity)
    {
        try {
            $this->setStatement("INSERT INTO ep_building (number, capacity) VALUES (?,?)");
            return $this->statement->execute([$name, $capacity]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateBuilding($bldg_data)
    {
        try {
            $this->setStatement("UPDATE ep_building SET number = ?, capacity = ? WHERE id = ?");
            return $this->statement->execute([$bldg_data->number, $bldg_data->capacity, $bldg_data->id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteBuilding($bldg_id)
    {
        try {
            $this->setStatement("DELETE FROM ep_building WHERE id = ?");
            return $this->statement->execute([$bldg_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function checkUserBuilding($user_id, $bldg_id)
    {
        try {
            $this->setStatement("SELECT * FROM ep_user_building WHERE user_id = ? AND building_id = ?");
            $this->statement->execute([$user_id, $bldg_id]);
            return $this->statement->rowCount();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function insertUserBuilding($user_id, $bldg_id){
        try {
            $this->setStatement("INSERT INTO ep_user_building (user_id, building_id) VALUES (?,?)");
            return $this->statement->execute([$user_id, $bldg_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteUserBuilding($user_id, $bldg_id){
        try {
            $this->setStatement("DELETE FROM ep_user_building WHERE user_id = ? AND building_id = ?");
            return $this->statement->execute([$user_id, $bldg_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
