<?php
require_once 'authController.php';
class Building extends Controller
{

    function retrieve_buildings()
    {
        try {
            $this->setStatement("SELECT * FROM ep_building");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieve_buildings_by_user_id($user_id)
    {
        try {
            $this->setStatement("SELECT ub.user_id, b.id as building_id, b.name, b.capacity FROM ep_building b JOIN ep_user_bulding ub ON b.id = ub.building_id WHERE ub.user_id = ? ORDER BY ub.building_id ASC");
            $this->statement->execute([$user_id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
?>