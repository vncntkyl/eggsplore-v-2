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

    function register_user($userdata)
    {
        try {
            $this->setStatement("INSERT INTO ep_users (first_name, middle_name, last_name, username, password, user_type, status) VALUES(?,?,?,?,?,?,?)");
            return $this->statement->execute([$userdata->first_name, $userdata->middle_name, $userdata->last_name, $userdata->username, $userdata->password, $userdata->user_type, $userdata->status]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveUsers()
    {
        try {
            $this->setStatement("SELECT user_id, first_name, middle_name, last_name, username, user_type, status FROM ep_users WHERE status = 1");
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
    function updateUser($user)
    {
        try {
            $this->setStatement("UPDATE ep_users SET first_name = ?, middle_name = ?, last_name = ?, username = ? WHERE user_id = ?");
            return $this->statement->execute([$user->first_name, $user->middle_name, $user->last_name, $user->username]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteUser($user_id)
    {
        try {
            $this->setStatement("UPDATE ep_users SET status = 0 WHERE user_id = ?");
            return $this->statement->execute([$user_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
