<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/feedsController.php";
$feeds = new Feeds();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        if (isset($_GET['feeds_consumption'])) {
            echo json_encode($feeds->retrieve_feeds_consumption($_GET['id']));
        } else if (isset($_GET['feedsCurrentQuantity'])) {
            echo json_encode($feeds->get_feed_quantity());
        } else if (isset($_GET['feeds_inventory'])) {
            $filter = isset($_GET['filter']) ? (gettype($_GET['filter']) == "object" ? json_decode($_GET['filter']) : $_GET['filter']) : "all";
            echo json_encode($feeds->retrieve_feeds_inventory($filter));
        } else if (isset($_GET['feeds_medicine'])){
            echo json_encode($feeds->retrieveOverviewToday());
        } else {
            echo json_encode($feeds->retrieve_feeds($_GET['id']));
        }
        break;
    case "POST":
        $method = $_POST['method'];
        if ($method === "add") {
            $name = $_POST['feeds_name'];
            $description = $_POST['feeds_description'];
            echo $feeds->addFeeds($name, $description) ? 1 : 0;
        } else if ($method === "add consumption") {
            $consumption_data = json_decode($_POST['data']);
            echo $feeds->add_feeds_consumption($consumption_data) ? 1 : 0;
        } else if ($method === "add inventory") {
            $feeds_data = json_decode($_POST['feeds_data']);
            echo $feeds->insert_feeds_inventory($feeds_data) ? 1 : 0;
        }
        break;
    case "PUT":
        $feeds_data = json_decode(file_get_contents('php://input'));
        if (isset($feeds_data->updateInventory)) {
            echo $feeds->update_feeds_inventory($feeds_data) ? 1 : 0;
        } else if (isset($feeds_data->updateConsumption)) {
            echo $feeds->update_feeds_consumption($feeds_data) ? 1 : 0;
        } else {
            echo $feeds->updateFeeds($feeds_data) ? 1 : 0;
        }
        break;
    case "DELETE":
        $id = $_GET['id'];
        echo $feeds->deleteFeeds($id) ? 1 : 0;
        break;
}
