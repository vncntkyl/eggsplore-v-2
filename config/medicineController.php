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
    function addMedicine($medicine_name, $dosage_instructions, $usage_indication)
    {
        try {
            $this->setStatement("INSERT INTO ep_medicine (medicine_name, dosage_instructions, usage_indication) VALUES (?,?,?)");
            return $this->statement->execute([$medicine_name, $dosage_instructions, $usage_indication]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateMedicine($med)
    {
        try {
            $this->setStatement("UPDATE ep_medicine SET medicine_name = ?, dosage_instructions = ?, usage_indication = ? WHERE medicine_id = ?");
            return $this->statement->execute([$med->medicine_name, $med->dosage_instructions, $med->usage_indication, $med->medicine_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteMedicine($medicine_id)
    {
        try {
            $this->setStatement("DELETE FROM ep_medicine WHERE medicine_id = ?");
            return $this->statement->execute([$medicine_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
