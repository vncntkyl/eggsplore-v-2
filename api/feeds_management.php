<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/feedsController.php";
$feeds = new Feeds();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $get_type = $_GET['id'];
        echo json_encode($feeds->retrieve_feeds($get_type));
        break;
    case "POST":
        $method = $_POST['method'];
        if ($method === "add") {
            $name = $_POST['feeds_name'];
            $description = $_POST['feeds_description'];
            echo $feeds->addFeeds($name, $description) ? 1 : 0;
        }
        break;
    case "PUT":
        $feeds_data = json_decode(file_get_contents('php://input'));
        echo $feeds->updateFeeds($feeds_data) ? 1 : 0;
        break;
    case "DELETE":
        $id = $_GET['id'];
        echo $feeds->deleteFeeds($id) ? 1 : 0;
        break;
}
