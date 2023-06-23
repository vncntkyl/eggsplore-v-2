<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "../config/userController.php";
$user = new User();

if (isset($_GET['getUser'])) {
    $param = $_GET['getUser'];
    if ($param === "all") {
        $result = $user->retrieveUsers();
        echo json_encode($result);
    } else {
        $result = $user->retrieveUserByID($param);
        echo json_encode($result);
    }
}
?>