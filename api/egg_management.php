<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/eggController.php";
$egg = new Egg();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $retrieve_type = $_GET['retrieve'];
        if ($retrieve_type === "production") {
            $filter = isset($_GET['filter']) ? (gettype($_GET['filter']) == "object" ? json_decode($_GET['filter']) : $_GET['filter']) : "all";
            echo json_encode($egg->retrieveEggProduction($filter));
        } else if ($retrieve_type === "unsorted_egg_production") {
            echo json_encode($egg->retrieveEggsForSegregation($_GET['user_id']));
        } else if ($retrieve_type === "segregation_logs") {
            echo json_encode($egg->retrieveEggSegregationLogs($_GET['user_id']));
        } else if ($retrieve_type === "egg_classifications") {
            echo json_encode($egg->retrieveEggClasifications());
        } else if ($retrieve_type === "egg_procurement") {
            $filter = isset($_GET['filter']) ? (gettype($_GET['filter']) == "object" ? json_decode($_GET['filter']) : $_GET['filter']) : "all";
            echo json_encode($egg->retrieveProcurement($filter));
        } else if ($retrieve_type === "egg_inventory") {
            $filter = isset($_GET['filter']) ? (gettype($_GET['filter']) == "object" ? json_decode($_GET['filter']) : $_GET['filter']) : "all";
            echo json_encode($egg->retrieveEggsInventory());
        } else if ($retrieve_type === "egg_overview") {
            echo json_encode($egg->retrieveEggOverview());
        } else if ($retrieve_type === "performance_overview") {
            echo json_encode($egg->retrieveEggInventoryOverview());
        }
        break;
    case "POST":
        $method = $_POST['method'];
        switch ($method) {
            case "staff_add":
                $egg_data = json_decode($_POST['egg_data']);
                $building_no = $_POST['building_no'];
                echo $egg->procureEgg($egg_data, $building_no) ? 1 : 0;
                break;
            case "add_segregation":
                $segregated_eggs = json_decode($_POST['segregation_data']);
                echo $egg->segregateEggProduction($segregated_eggs) ? 1 : 0;
                break;
            case "procure_egg":
                $procurement_data = json_decode($_POST['procurement_data']);
                echo $egg->procureBrownEgg($procurement_data) ? 1 : 0;
        }
        // if ($method === "add") {
        //     $name = $_POST['feeds_name'];
        //     $description = $_POST['feeds_description'];
        //     echo $feeds->addFeeds($name, $description) ? 1 : 0;
        // }
        break;
    case "PUT":
        $egg_data = json_decode(file_get_contents('php://input'));
        if ($egg_data->adminUpdate) {
            echo $egg->updateProcurement($egg_data) ? 1 : 0;
        } else {
            echo $egg->updateEggProduction($egg_data->egg_count, $egg_data->defect_count, $egg_data->id) ? 1 : 0;
        }
        break;
    case "DELETE":
        // $id = $_GET['id'];
        // echo $feeds->deleteFeeds($id) ? 1 : 0;
        break;
}
