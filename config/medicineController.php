<?php
require_once 'authController.php';
class Medicine extends Controller
{
    function retrieve_medicine($id = "all")
    {
        try {
            $statement = "SELECT * FROM ep_medicine ";
            if ($id !== "all") {
                $statement .= "WHERE medicine_id = ?";
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
    function add_medicine($medicine_name, $dosage_instructions, $usage_indication)
    {
        try {
            $this->setStatement("INSERT INTO ep_medicine (medicine_name, dosage_instructions, usage_indication) VALUES (?,?,?)");
            return $this->statement->execute([$medicine_name, $dosage_instructions, $usage_indication]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_medicine($med)
    {
        try {
            $this->setStatement("UPDATE ep_medicine SET medicine_name = ?, dosage_instructions = ?, usage_indication = ? WHERE medicine_id = ?");
            return $this->statement->execute([$med->medicine_name, $med->dosage_instructions, $med->usage_indication, $med->medicine_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function delete_medicine($medicine_id)
    {
        try {
            $this->setStatement("DELETE FROM ep_medicine WHERE medicine_id = ?");
            return $this->statement->execute([$medicine_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    //MEDICATION INTAKE
    function retrieve_medication_intake($id = "all")
    {
        try {
            $statement = "SELECT * FROM ep_medication_intake ";
            if ($id !== "all") {
                $statement .= "WHERE medicine_id = ?";
            }
            $this->setStatement($statement . " ORDER BY id DESC");
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
    function add_medication_intake($intake_data)
    {
        try {
            $this->setStatement("INSERT INTO ep_medication_intake (medicine_id, intake, disposed, remaining, remarks, date_procured, staff_id, building_id, log_date)
             VALUES (?,?,?,?,?,?,?,?,?)");
            return $this->statement->execute([
                $intake_data->medicine_id,
                $intake_data->intake,
                $intake_data->disposed,
                $intake_data->remaining,
                $intake_data->remarks,
                $intake_data->date,
                $intake_data->staff,
                $intake_data->building,
                $intake_data->log_date,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_medication_intake($intake_data)
    {
        try {
            $this->setStatement("UPDATE ep_medication_intake SET intake = ?, disposed = ?, remaining = ?, remarks = ? WHERE id = ?");
            return $this->statement->execute([
                $intake_data->intake,
                $intake_data->disposed,
                $intake_data->remaining,
                $intake_data->remarks,
                $intake_data->id,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    //MEDICINE INVENTORY
    function retrieve_medicine_inventory($filter)
    {
        try {
            $sqlStatement = "SELECT * FROM ep_medicine_inventory ";
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
            }
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function insert_medicine_inventory($medicine_data)
    {
        try {
            $this->setStatement("INSERT INTO ep_medicine_inventory (medicine_id, date_received, quantity, expiration_date, supplier, amount, log_date)
            VALUES (?,?,?,?,?,?,?)");
            return $this->statement->execute([
                $medicine_data->medicine,
                $medicine_data->date_received,
                $medicine_data->quantity,
                $medicine_data->expiration_date,
                $medicine_data->supplier,
                $medicine_data->amount,
                $medicine_data->log_date,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }

    function update_medicine_inventory($med)
    {
        try {
            $this->setStatement("UPDATE ep_medicine_inventory SET medicine_id = ?, date_received = ?, quantity = ?, expiration_date = ?, supplier = ?, amount = ?, log_date = ? WHERE id = ?");
            return $this->statement->execute([
                $med->medicine,
                $med->date_received,
                $med->quantity,
                $med->expiration_date,
                $med->supplier,
                $med->amount,
                $med->log_date,
                $med->id
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }

    function get_medicine_quantity()
    {
        try {
            $this->setStatement("SELECT i.medicine_id,
            COALESCE(i.total_received, 0) - COALESCE(m.total_taken, 0) AS remaining_quantity
            FROM (
                SELECT medicine_id, SUM(quantity) AS total_received
                FROM ep_medicine_inventory
                GROUP BY medicine_id
            ) i
            LEFT JOIN (
                SELECT medicine_id, SUM(disposed + intake) AS total_taken
                FROM ep_medication_intake
                GROUP BY medicine_id
            ) m ON i.medicine_id = m.medicine_id");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function get_latest_medication_intake($medicine_id)
    {
        try {
            $this->setStatement("SELECT * FROM `ep_medication_intake` WHERE medicine_id = ? ORDER BY log_date DESC LIMIT 1;");
            $this->statement->execute([$medicine_id]);
            return $this->statement->fetch();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function get_medicine_report($start_date, $end_date)
    {
        try {
            $this->setStatement("SELECT
            DATE_FORMAT(med.log_date, '%Y-%m') AS month,
            medicine.medicine_name,
            COALESCE(SUM(med.amount), 0) AS medicine_expense
        FROM
            ep_medicine_inventory AS med
        JOIN ep_medicine AS medicine ON med.medicine_id = medicine.medicine_id
        WHERE
            DATE(med.log_date) >= ? AND DATE(med.log_date) <= ?
        GROUP BY
            month,
            medicine.medicine_name
        ORDER BY
            month, 
            medicine.medicine_name;");
            $this->statement->execute([$start_date, $end_date]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
