<?php
require_once 'authController.php';
class Egg extends Controller
{

    function procureEgg($egg_data)
    {
        try {
            $this->setStatement("INSERT INTO ep_egg_production (date_produced, egg_count, defect_count, building_id, user_id, log_date) VALUES (?,?,?,?,?,?)");
            return $this->statement->execute([$egg_data->date, $egg_data->count, $egg_data->defect, $egg_data->building, $egg_data->staff, $egg_data->log_date]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggProduction($filter = "all")
    {
        try {
            $sqlStatement = "SELECT * FROM ep_egg_production ";
            if ($filter !== 'all') {
                if ($filter === 'today') {
                    $sqlStatement .= " WHERE DATE(log_date) = DATE(NOW()) ORDER BY log_date DESC";
                } else if ($filter === 'yesterday') {
                    $sqlStatement .= " WHERE DATE(log_date) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)) ORDER BY log_date DESC";
                } else if ($filter === 'this_week') {
                    $sqlStatement .= " WHERE WEEK(log_date) = WEEK(NOW()) ORDER BY log_date DESC";
                } else if ($filter === 'this_month') {
                    $sqlStatement .= " WHERE MONTH(log_date) = MONTH(NOW()) ORDER BY log_date DESC";
                } else {
                    $filter = json_decode($filter);
                    $sqlStatement .= " WHERE log_date >= '" . $filter->start_date . "' AND log_date <= '" . $filter->end_date . "' ORDER BY log_date DESC";
                }
            } else {
                $sqlStatement .= " ORDER BY log_date DESC";
            }
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateEggProduction($egg_count, $defect_count, $production_id)
    {
        try {
            $this->setStatement("UPDATE ep_egg_production SET egg_count = ?, defect_count = ? WHERE egg_production_id = ?");
            return $this->statement->execute([$egg_count, $defect_count, $production_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    //EGG SEGREGATION FUNCTIONS

    function retrieveEggsForSegregation($staff_id)
    {
        try {
            $this->setStatement("SELECT
            ep.egg_production_id,
            (ep.egg_count - COALESCE(ep.defect_count, 0)) AS eggs,
            ep.date_produced
        FROM
            ep_egg_production AS ep
        LEFT JOIN
            ep_egg_segregation AS es ON ep.egg_production_id = es.production_id
        WHERE
            es.production_id IS NULL AND ep.user_id = ?
        ORDER BY
            ep.log_date DESC");
            $this->statement->execute([$staff_id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggSegregationLogs($staff_id)
    {
        try {
            $this->setStatement("SELECT * FROM ep_egg_segregation WHERE user_id = ? ORDER BY log_date DESC");
            $this->statement->execute([$staff_id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggClasifications()
    {
        try {
            $this->setStatement("SELECT * FROM ep_egg_types");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function segregateEggProduction($data)
    {
        try {
            $this->setStatement("INSERT INTO ep_egg_segregation (production_id, no_weight, pewee, pullet, brown, small, medium, large, extra_large, jumbo, crack, soft_shell, user_id, log_date)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            if ($this->statement->execute([
                $data->production_id,
                $data->no_weight,
                $data->pewee,
                $data->pullet,
                $data->brown,
                $data->small,
                $data->medium,
                $data->large,
                $data->extra_large,
                $data->jumbo,
                $data->crack,
                $data->soft_shell,
                $data->user_id,
                $data->log_date,
            ])) {
                $status = array();
                unset($data->production_id);
                unset($data->user_id);
                unset($data->log_date);

                $objectVars = get_object_vars($data);
                foreach ($objectVars as $key => $value) {
                    $this->updateEggClassifications($value, str_replace('_', ' ', $key)) ? array_push($status, 1) : array_push($status, 0);
                }

                if (in_array(0, $status)) {
                    return 0;
                } else {
                    return 1;
                }
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateEggClassifications($count, $classification)
    {
        try {
            $this->setStatement("BEGIN;

            SET @egg_count = (SELECT et.egg_type_total_count as count FROM ep_egg_types as et WHERE et.egg_type_name = :name);
            
            UPDATE ep_egg_types SET egg_type_total_count = @egg_count + :count WHERE egg_type_name = :name;
            
            COMMIT;");
            return $this->statement->execute([":count" => $count, ":name" => $classification]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function procureBrownEgg($data)
    {
        try {
            $this->setStatement("INSERT INTO ep_egg_procurement (egg_type,quantity,supplier,amount,date_procured,log_date) 
            VALUES (?,?,?,?,?,?)");
            if ($this->statement->execute([
                $data->egg_type,
                $data->quantity,
                $data->supplier,
                $data->amount,
                $data->date_procured,
                $data->log_date,
            ])) {
                return $this->updateEggClassifications($data->quantity, str_replace('_', ' ', $data->egg_type));
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateProcurement($data)
    {
        try {
            $this->setStatement("BEGIN;
            SET @qty = (SELECT quantity as qty FROM ep_egg_procurement WHERE egg_procurement_id = :proc_id);
            SET @eggQty = (SELECT egg_type_total_count as eggQty FROM ep_egg_types WHERE egg_type_name = :egg_type);
            
            UPDATE `ep_egg_procurement` SET `egg_type`= :egg_type,`quantity`= :qty,`supplier`= :supplier,`amount`= :amt WHERE `egg_procurement_id` = :proc_id;
            UPDATE ep_egg_types SET egg_type_total_count = (@eggQty - @qty) + :qty WHERE egg_type_name = :egg_type;
            COMMIT;
            ");
            return $this->statement->execute([
                ":egg_type" => $data->egg_type,
                ":qty" => $data->quantity,
                ":supplier" => $data->supplier,
                ":amt" => $data->amount,
                ":proc_id" => $data->egg_procurement_id,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveProcurement($filter)
    {
        try {
            $sqlStatement = "SELECT * FROM ep_egg_procurement ";
            if ($filter !== 'all') {
                if ($filter === 'this_month') {
                    $sqlStatement .= " WHERE MONTH(log_date) = MONTH(NOW()) ORDER BY log_date DESC";
                } else {
                    $filter = json_decode($filter);
                    $sqlStatement .= " WHERE log_date >= '" . $filter->start_date . "' AND log_date <= '" . $filter->end_date . "' ORDER BY log_date DESC";
                }
            } else {
                $sqlStatement .= " ORDER BY log_date DESC";
            }
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }

    function retrieveEggsInventory()
    {
        try {
            $this->setStatement("SELECT
            production_eggs.week,
             COALESCE(production_eggs.total_eggs, 0) + COALESCE(procurement_eggs.total_eggs, 0) AS total_combined_eggs
        FROM (
            SELECT WEEK(log_date) AS week, (SUM(egg_count) + SUM(defect_count)) AS total_eggs
            FROM ep_egg_production
            GROUP BY WEEK(log_date)
        ) AS production_eggs
        LEFT JOIN (
            SELECT WEEK(log_date) AS week, SUM(quantity) AS total_eggs
            FROM ep_egg_procurement
            GROUP BY WEEK(log_date)
        ) AS procurement_eggs ON production_eggs.week = procurement_eggs.week;");
        $this->statement->execute();
        $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
