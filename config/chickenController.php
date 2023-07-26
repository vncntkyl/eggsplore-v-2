<?php
require_once 'authController.php';
class Chicken extends Controller
{
    function retrieve_procurement($table = 'ep_chicks', $filter)
    {

        try {
            $sqlStatement = "SELECT * FROM " . $table . ($table === 'ep_chicks' ? " ORDER BY date_procured DESC" : "");
            if ($filter !== 'all') {
                if ($filter === 'today') {
                    $sqlStatement .= " WHERE DATE(date_procured) = DATE(NOW()) ORDER BY log_date DESC, date_procured DESC";
                } else if ($filter === 'yesterday') {
                    $sqlStatement .= " WHERE DATE(date_procured) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)) ORDER BY log_date DESC, date_procured DESC";
                } else if ($filter === 'this_week') {
                    $sqlStatement .= " WHERE WEEK(date_procured) = WEEK(NOW()) ORDER BY log_date DESC, date_procured DESC";
                } else if ($filter === 'this_month') {
                    $sqlStatement .= " WHERE MONTH(date_procured) = MONTH(NOW()) ORDER BY log_date DESC,  date_procured DESC";
                } else {
                    $filter = json_decode($filter);
                    $sqlStatement .= " WHERE date_procured >= '" . $filter->start_date . "' AND date_procured <= '" . $filter->end_date . "' ORDER BY log_date DESC,  date_procured DESC" ;
                }
            }else{
                if($table === "ep_chicken"){
                    $sqlStatement .= " ORDER BY log_date DESC, date_procured DESC";
                }
            }
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function insert_chick_procurement($procurement_date, $count, $supplier)
    {
        try {
            $sqlStatement = "
            SET @current_date = DATE_FORMAT(NOW(), '%y%m%d');
            SET @min_batch_number = CONVERT(CONCAT(@current_date, '-000') USING utf8mb4);
            SET @max_batch_number = CONVERT(CONCAT(@current_date, '-999') USING utf8mb4);

            SELECT MAX(batch_number) AS latest INTO @latest_batch_number
            FROM ep_chicks
            WHERE batch_number >= @min_batch_number AND batch_number <= @max_batch_number;

            SET @latest_batch_number = IFNULL(@latest_batch_number, CONCAT(@current_date, '-000'));
            SET @next_batch_number = CONCAT(@current_date, '-', LPAD(SUBSTRING(@latest_batch_number, 8) + 1, 3, '0'));

            INSERT INTO ep_chicks (batch_number, chick_count, supplier, date_procured)
            VALUES (@next_batch_number, ?, ?, ?);
            ";
            $this->setStatement($sqlStatement);
            return $this->statement->execute([$count, $supplier, $procurement_date]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_chick_procurement($procurement_data)
    {
        try {
            $this->setStatement("UPDATE ep_chicks SET chick_count = ?, supplier = ?, date_procured = ? WHERE chick_id = ?");
            return $this->statement->execute([$procurement_data->chickCount, $procurement_data->supplier, $procurement_data->procurementDate, $procurement_data->procurement_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function insert_chicken_management($procurement_data)
    {
        try {
            $this->setStatement("INSERT INTO ep_chicken (chicken_count,mortality_count, missing_count, remaining, remarks, date_procured, staff_id, building_id, log_date) 
            VALUES (?,?,?,?,?,?,?,?,?)");
            return $this->statement->execute([
                $procurement_data->population,
                $procurement_data->mortality,
                $procurement_data->missing,
                $procurement_data->remaining,
                $procurement_data->remarks,
                $procurement_data->date,
                $procurement_data->staff,
                $procurement_data->building,
                $procurement_data->log_date
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_chicken_maintenance($procurement_data){
        try {
            $this->setStatement("UPDATE ep_chicken SET chicken_count = ?, mortality_count = ?, missing_count = ?, remaining = ?, remarks = ? WHERE chicken_id = ?");
            return $this->statement->execute([
                $procurement_data->population,
                $procurement_data->mortality, 
                $procurement_data->missing, 
                $procurement_data->remaining,
                $procurement_data->remarks,
                $procurement_data->id]);
        } catch (PDOException $e) {
            $this->getError($e);
        } 
    }
    function get_chicken_population()
    {
        try {
            $this->setStatement("SELECT building_id, remaining as current_population FROM ep_chicken ORDER BY date_procured DESC LIMIT 1");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
