<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "../config/medicineController.php";
$medicine = new Medicine();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $get_type = $_GET['id'];
        if (isset($_GET['medication_intake'])) {
            echo json_encode($medicine->retrieve_medication_intake($get_type));
        } else if(isset($_GET['medicine_inventory'])) {
            echo json_encode($medicine->retrieve_medicine_inventory());
        } else {
            echo json_encode($medicine->retrieve_medicine($get_type));
        }
        break;
    case "POST":
        $method = $_POST['method'];
        if ($method === "add") {
            $medicine_name = $_POST['medicine_name'];
            $dosage_instructions = $_POST['dosage_instructions'];
            $usage_indication = $_POST['usage_indication'];
            echo $medicine->add_medicine($medicine_name, $dosage_instructions, $usage_indication) ? 1 : 0;
        } else if($method === "add intake") {
            $intake_data = json_decode($_POST['data']);
            echo $medicine->add_medication_intake($intake_data) ? 1 : 0;
        }
        
        break;
    case "PUT":
        $medicine_data = json_decode(file_get_contents('php://input'));
        echo $medicine->update_medicine($medicine_data) ? 1 : 0;
        break;
    case "DELETE":
        $id = $_GET['id'];
        echo $medicine->delete_medicine($id) ? 1 : 0;
        break;
}
