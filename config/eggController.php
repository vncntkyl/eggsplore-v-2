<?php
require_once 'authController.php';
class Egg extends Controller
{

    function procureEgg($egg_data)
    {
        try {
            $this->setStatement("INSERT INTO ep_egg_production (date_produced, egg_count, building_id, user_id, log_date) VALUES (?,?,?,?,?)");
            return $this->statement->execute([$egg_data->date, $egg_data->count, $egg_data->building, $egg_data->staff, $egg_data->log_date]);
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
    function retrieveEggProcurement($type = "admin", $selection_type = "all")
    {
        $sqlStatement = "SELECT * FROM ";
        if ($type === "staff") {
            $sqlStatement .= "ep_egg_production";
            if ($selection_type !== "all") {
                $sqlStatement .= " WHERE user_id = ? ORDER BY log_date DESC";
                $this->setStatement($sqlStatement);
                $this->statement->execute([$selection_type]);
                return $this->statement->fetchAll();
            } else {
                $this->setStatement($sqlStatement);
                $this->statement->execute();
                return $this->statement->fetchAll();
            }
        }
    }
}
