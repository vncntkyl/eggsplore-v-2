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
            return $e->getMessage();
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
    function retrieveEggSegregationLogs()
    {
    }
    function retrieveEggClasifications()
    {
    }
    function segregateEggProduction($data)
    {
        try {
            $this->setStatement("INSERT INTO ep_egg_segregation (production_id, no_weight, pewee, pullet, brown, small, medium, large, extra_large, jumbo, crack, soft_shell, user_id, log_date)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            return $this->statement->execute([
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
            ]);
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
    function updateEggClassifications($count, $classification)
    {
        try {
            $this->setStatement("UPDATE ep_egg_segregation SET egg_type_total_count = ? WHERE egg_type_name = ?");
            return $this->statement->execute([ $count, $classification ]);
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
    function procureBrownEgg()
    {
        //add into egg production and then add to segregation and classification
    }
}
