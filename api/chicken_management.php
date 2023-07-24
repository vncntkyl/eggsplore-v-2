<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "../config/chickenController.php";
$chicken = new Chicken();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        if (isset($_GET['retrieve'])) {
            $table_name = $_GET['retrieve'];
            $filter = isset($_GET['filter']) ? (gettype($_GET['filter']) == "object" ? json_decode($_GET['filter']) : $_GET['filter']) : "all";
            echo json_encode($chicken->retrieve_procurement($table_name, $filter));
        }
        break;
    case "POST":
        $type = $_POST['type'];
        if ($type === "chick") {
            $procurement_date = $_POST['procurementDate'];
            $chick_count = $_POST['chickCount'];
            $supplier = $_POST['supplier'];
            echo $chicken->insert_chick_procurement($procurement_date, $chick_count, $supplier) ? 1 : 0;
        } else {
            if ($_POST['method'] === "staff_add") {
                $chicken_data = json_decode($_POST['chickenData']);
                echo $chicken->insert_chicken_management($chicken_data) ? 1 : 0;
            }
        }
        break;
    case "PUT":
        $chick_procurement_data = json_decode(file_get_contents('php://input'));
        echo $chicken->update_chick_procurement($chick_procurement_data) ? 1 : 0;
        break;
    case "DELETE":
        break;
}
