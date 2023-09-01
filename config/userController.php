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
    function updateUser($user, $id)
    {
        try {
            $this->setStatement("UPDATE ep_users SET first_name = ?, middle_name = ?, last_name = ?, username = ? WHERE user_id = ?");
            return $this->statement->execute([$user->first_name, $user->middle_name, $user->last_name, $user->username, $id]);
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
    function getUserNotifications()
    {
        try {
            $this->setStatement("SELECT
            'ep_egg_production' AS source_table,
            egg_production_id AS record_id,
            log_date
        FROM
            ep_egg_production
        UNION ALL
        SELECT
            'ep_chicken' AS source_table,
            chicken_id AS record_id,
            log_date
        FROM
            ep_chicken
        UNION ALL
        SELECT
            'ep_medication_intake' AS source_table,
            id AS record_id,
            log_date
        FROM
            ep_medication_intake
        UNION ALL
        SELECT
            'ep_feeds_consumption' AS source_table,
            id AS record_id,
            log_date
        FROM
            ep_feeds_consumption
        UNION ALL
        SELECT
            'ep_egg_segregation' AS source_table,
            segregation_id AS record_id,
            log_date
        FROM
            ep_egg_segregation
        ORDER BY
            log_date
        DESC LIMIT 5
            ;");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function getNotification($table, $id)
    {
        $sql = "";
        switch ($table) {
            case "ep_egg_production":
                $sql = "SELECT * FROM " . $table . " WHERE egg_production_id = ?;";
                break;
            case "ep_chicken":
                $sql = "SELECT * FROM " . $table . " WHERE chicken_id = ?;";
                break;
            case "ep_medication_intake":
            case "ep_feeds_consumption":
                $sql = "SELECT * FROM " . $table . " WHERE id = ?;";
                break;
            case "ep_egg_segregation":
                $sql = "SELECT * FROM " . $table . " WHERE segregation_id = ?;";
                break;
        }
        try {
            $this->setStatement($sql);
            $this->statement->execute([$id]);
            return $this->statement->fetch();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
