<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require "../config/userController.php";
$user = new User();

if (isset($_POST['userdata'])) {
    $user_data = json_decode($_POST['userdata']);
    $user_data->password = md5($user_data->password);
    echo $user->register_user($user_data) ? 1 : 0;
}
?>