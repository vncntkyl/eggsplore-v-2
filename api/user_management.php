<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/userController.php";
require "../config/buildingController.php";
$user = new User();
$bldg = new Building();

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
    $status = array();
    if (isset($_POST['update_password'])) {
        $currentPassword = $_POST['currentPassword'];
        $newPassword = $_POST['newPassword'];
        $userId = $_POST['userId'];
        echo $user->updatePassword($currentPassword, $newPassword, $userId) ? 1 : 0;
    } else {
        $userdata = json_decode($_POST['userdata']);
        $user_id = intval($_POST['user_id']);
        $buildingdata = json_decode($_POST['buildingdata']);
        $buildingsForInsertion = $buildingdata->addedItems;
        $buildingsForRemoval = $buildingdata->removedItems;
        if ($user->updateUser($userdata, $user_id)) {
            $mergedItems = array_merge($buildingsForInsertion, $buildingsForRemoval);
            // var_dump($mergedItems);
            if (count($mergedItems) > 0) {
                //check if item already exists in database
                foreach ($mergedItems as $item) {
                    if ($bldg->checkUserBuilding($user_id, intval($item->building_id)) > 0) {
                        if ($bldg->deleteUserBuilding($user_id, intval($item->building_id))) {
                            array_push($status, 1);
                        } else {
                            array_push($status, 0);
                        }
                    } else {
                        if ($bldg->insertUserBuilding($user_id, intval($item->building_id))) {
                            array_push($status, 1);
                        } else {
                            array_push($status, 0);
                        }
                    }
                }
            }
        }
        if (in_array(0, $status)) {
            echo 0;
        } else {
            echo 1;
        }
    }
}

if (isset($_GET['user_notifications'])) {
    $notifications = $user->getUserNotifications();
    $newNotifications = array();
    foreach ($notifications as $notification) {
        array_push($newNotifications, $user->getNotification($notification->source_table, $notification->record_id));
    }
    echo json_encode($newNotifications);
}
