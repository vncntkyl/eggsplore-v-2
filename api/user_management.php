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

if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    $id = $_GET['id'];
    echo $user->deleteUser($id) ? 1 : 0;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userdata = json_decode($_POST['userdata']);
    $user_id = $_POST['user_id'];
    echo $user->updateUser($userdata, $user_id) ? 1 : 0;
}
?>