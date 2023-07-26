<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/eggController.php";
$egg = new Egg();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $retrieve_type = $_GET['retrieve'];
        if ($retrieve_type === "procurement") {
            echo json_encode($egg->retrieveEggProcurement($_GET['type'], $_GET['selectionType']));
        }
        break;
    case "POST":
        $method = $_POST['method'];
        switch ($method) {
            case "staff_add":
                $egg_data = json_decode($_POST['egg_data']);
                echo $egg->procureEgg($egg_data) ? 1 : 0;
                break;
        }
        // if ($method === "add") {
        //     $name = $_POST['feeds_name'];
        //     $description = $_POST['feeds_description'];
        //     echo $feeds->addFeeds($name, $description) ? 1 : 0;
        // }
        break;
    case "PUT":
        // $feeds_data = json_decode(file_get_contents('php://input'));
        // echo $feeds->updateFeeds($feeds_data) ? 1 : 0;
        break;
    case "DELETE":
        // $id = $_GET['id'];
        // echo $feeds->deleteFeeds($id) ? 1 : 0;
        break;
}
