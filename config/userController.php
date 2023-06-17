<?php
require_once 'authController.php';
class User extends Controller
{

    function login_user($username, $password)
    {
        try {
            $this->setStatement("SELECT user_id, first_name, middle_name, last_name, username, user_type, building_id, status FROM ep_users WHERE username = ? AND password = ?");
            $this->statement->execute([$username, $password]);
            if ($result = $this->statement->fetch()) {
                return $result;
            } else {
                echo "Incorrect username or password. Please try again.";
            }
        } catch (PDOException $e) {
            echo "An exception occurred: " . $e->getMessage();
            echo "Error code: " . $e->getCode();
            echo "File: " . $e->getFile();
            echo "Line: " . $e->getLine();
        }
    }
}
