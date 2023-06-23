<?php
require_once 'authController.php';
class User extends Controller
{

    function login_user($username, $password)
    {
        try {
            $this->setStatement("SELECT user_id, first_name, middle_name, last_name, username, user_type, status FROM ep_users WHERE username = ? AND password = ?");
            $this->statement->execute([$username, $password]);
            if ($result = $this->statement->fetch()) {
                return $result;
            } else {
                echo "Incorrect username or password. Please try again.";
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }

    function retrieveUsers()
    {
        try {
            $this->setStatement("SELECT user_id, first_name, middle_name, last_name, username, user_type, status FROM ep_users");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveUserByID($id)
    {
        try {
            $this->setStatement("SELECT user_id, first_name, middle_name, last_name, username, user_type, status FROM ep_users WHERE user_id = ?");
            $this->statement->execute([$id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
?>