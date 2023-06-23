<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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
    }
}
?>