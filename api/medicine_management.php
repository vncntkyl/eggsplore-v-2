<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/medicineController.php";
$medicine = new Medicine();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        if (isset($_GET['medication_intake'])) {
            echo json_encode($medicine->retrieve_medication_intake($_GET['id']));
        } else if(isset($_GET['medicineCurrentQuantity'])){
            echo json_encode($medicine->getMedicineQuantity());
        }else if (isset($_GET['medicine_inventory'])) {
            echo json_encode($medicine->retrieve_medicine_inventory());
        } else {
            echo json_encode($medicine->retrieve_medicine($_GET['id']));
        }
        break;
    case "POST":
        $method = $_POST['method'];
        if ($method === "add") {
            $medicine_name = $_POST['medicine_name'];
            $dosage_instructions = $_POST['dosage_instructions'];
            $usage_indication = $_POST['usage_indication'];
            echo $medicine->add_medicine($medicine_name, $dosage_instructions, $usage_indication) ? 1 : 0;
        } else if ($method === "add intake") {
            $intake_data = json_decode($_POST['data']);
            echo $medicine->add_medication_intake($intake_data) ? 1 : 0;
        } else if ($method === "add inventory") {
            $medicine_data = json_decode($_POST['medicine_data']);
            echo $medicine->insert_medicine_inventory($medicine_data) ? 1 : 0;
        }

        break;
    case "PUT":
        $medicine_data = json_decode(file_get_contents('php://input'));
        if (isset($medicine_data->updateInventory)) {
            echo $medicine->update_medicine_inventory($medicine_data) ? 1 : 0;
        } else {
            echo $medicine->update_medicine($medicine_data) ? 1 : 0;
        }
        break;
    case "DELETE":
        $id = $_GET['id'];
        echo $medicine->delete_medicine($id) ? 1 : 0;
        break;
}
