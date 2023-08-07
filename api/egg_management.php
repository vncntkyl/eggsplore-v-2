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
        }
        break;
    case "POST":
        $method = $_POST['method'];
        switch ($method) {
            case "staff_add":
                $egg_data = json_decode($_POST['egg_data']);
                echo $egg->procureEgg($egg_data) ? 1 : 0;
                break;
            case "add_segregation":
                $segregated_eggs = json_decode($_POST['segregation_data']);
                $objectVars = get_object_vars($segregated_eggs);
                foreach ($objectVars as $key => $value) {
                    echo $key . " " . $value;
                    // $this->updateEggClassifications($data[$key], str_replace('_', ' ', $key));
                }
                // echo $egg->segregateEggProduction($segregated_eggs) ? 1 : 0;
                break;
        }
        // if ($method === "add") {
        //     $name = $_POST['feeds_name'];
        //     $description = $_POST['feeds_description'];
        //     echo $feeds->addFeeds($name, $description) ? 1 : 0;
        // }
        break;
    case "PUT":
        $egg_data = json_decode(file_get_contents('php://input'));
        echo $egg->updateEggProduction($egg_data->egg_count, $egg_data->defect_count, $egg_data->id) ? 1 : 0;
        break;
    case "DELETE":
        // $id = $_GET['id'];
        // echo $feeds->deleteFeeds($id) ? 1 : 0;
        break;
}
