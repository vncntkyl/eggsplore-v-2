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
    } else {
        $result = $bldg->retrieve_buildings_by_user_id($param);
        echo json_encode($result);
    }
    // session_start();
    // $user_login = $_POST['user_login'];
    // $password = md5($_POST['password']);
    // $result = $user->login_user($user_login, $password);
    // if(gettype($result) == 'object'){
    //     echo json_encode($result);
    // }else{
    //     echo $result;
    // }
}
?>