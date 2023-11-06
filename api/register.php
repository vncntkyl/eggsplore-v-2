<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "../config/userController.php";
require "../config/buildingController.php";
$user = new User();

if (isset($_POST['userdata'])) {
    $status = array();
    $user_data = json_decode($_POST['userdata']);
    $user_data->password = md5($user_data->password);
    // echo $user->register_user($user_data) ? 1 : 0;
    if ($user_id = $user->register_user($user_data)) {
        $buildings = $user_data->buildings;
        $bldg = new Building();
        foreach ($buildings as $item) {
            if ($bldg->insertUserBuilding($user_id, intval($item->building_id))) {
                array_push($status, 1);
            } else {
                array_push($status, 0);
            }
        }
        if (in_array(0, $status)) {
            echo 0;
        } else {
            echo 1;
        }
    }
}
