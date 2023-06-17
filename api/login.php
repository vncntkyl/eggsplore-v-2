<?php
header("Access-Control-Allow-Origin: *");
require "../config/userController.php";
$user = new User();

if (isset($_POST['user_login']) && isset($_POST['password'])) {
    session_start();
    $user_login = $_POST['user_login'];
    $password = md5($_POST['password']);
    $result = $user->login_user($user_login, $password);
    if(gettype($result) == 'object'){
        echo json_encode($result);
    }else{
        echo $result;
    }
}
?>