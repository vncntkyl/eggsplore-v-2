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
                $intake_data->date_procured,
                $intake_data->staff_id,
                $intake_data->building_id,
                $intake_data->log_date,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    //MEDICINE INVENTORY
    function retrieve_medicine_inventory()
    {
        try {
            $this->setStatement("SELECT * FROM ep_medicine_inventory");
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
                $medicine_data->medicine_id,
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
}
