<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/locationController.php";
$location = new Locations();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $get_type = $_GET['id'];
        echo json_encode($location->retrieve_locations($get_type));
        break;
    case "POST":
        $method = $_POST['method'];
        if ($method === "add") {
            $location_name = $_POST['location_name'];
            echo $location->add_location($location_name) ? 1 : 0;
        }
        break;
    case "PUT":
        $location_data = json_decode(file_get_contents('php://input'));
        echo $location->update_location($location_data) ? 1 : 0;
        break;
    case "DELETE":
        $id = $_GET['id'];
        echo $location->delete_location($id) ? 1 : 0;
        break;
}
?>