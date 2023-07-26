<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/buildingController.php";
$bldg = new Building();

if (isset($_GET['getBuilding'])) {
    $param = $_GET['getBuilding'];
    if ($param === "all") {
        $result = $bldg->retrieve_buildings();
        echo json_encode($result);
    } else if ($param === "relation") {
        $result = $bldg->retrieve_all_user_buildings();
        echo json_encode($result);
    } else{
        $result = $bldg->retrieve_buildings($param);
        echo json_encode($result);
    }
}
switch ($_SERVER['REQUEST_METHOD']) {
    case "POST":
        if (isset($_POST['add_bldg'])) {
            $bldg_name = $_POST['number'];
            $bldg_capacity = $_POST['capacity'];
            echo $bldg->addBuilding($bldg_name,$bldg_capacity) ? 1 : 0;
        }
        break;
    case "PUT":
        $data = json_decode(file_get_contents('php://input'));
        echo $bldg->updateBuilding($data) ? 1 : 0;
        break;
    case "DELETE":
        $id = $_GET['id'];
        echo $bldg->deleteBuilding($id) ? 1 : 0;
        break;
}
