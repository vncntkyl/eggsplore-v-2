<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/deliveryController.php";
$delivery = new Delivery();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $retrieve_type = $_GET['retrieve'];
        switch ($retrieve_type) {
            case "delivery_monitoring":
                $filter = isset($_GET['filter']) ? (gettype($_GET['filter']) == "object" ? json_decode($_GET['filter']) : $_GET['filter']) : "all";
                echo json_encode($delivery->retrieve_delivery_monitoring($filter));
                break;
        }
        break;
    case "POST":
        $method = $_POST['method'];
        switch ($method) {
            case "insert_delivery_info":
                $status = array();
                $delivery_data = json_decode($_POST['deliveryData']);
                $invoice_list = json_decode($_POST['invoices']);
                $delivery_list = array();
                foreach ($delivery_data as $del) {
                    array_push($delivery_list, $del);
                }
                $delivery_id = $delivery->insert_delivery_monitoring($delivery_list);

                foreach ($invoice_list as $invoice) {
                    if ($delivery->updateSalesDeliveryInvoice($delivery_id, $invoice)) {
                        array_push($status, 1);
                    } else {
                        array_push($status, 0);
                    }
                }
                echo !in_array(0, $status) ? 1 : 0;
                break;
        }
        break;
    case "PUT":
        $delivery_data = json_decode(file_get_contents('php://input'));
        if ($delivery_data->update) {
            $data = $delivery_data->deliveryData;
            $delivery_id = $data->delivery_id;
            $delivery_list = array();

            unset($data->delivery_id);
            unset($data->dispatch_id);
            unset($data->actual_arrival);
            unset($data->status);
            unset($data->log_date);

            foreach ($data as $del) {
                array_push($delivery_list, $del);
            }
            array_push($delivery_list, intval($delivery_id));
            
            if($delivery->update_delivery_information($delivery_list)){
                echo 1;
            }else{
                echo 0;
            }
        } else {
            if ($delivery->update_delivery_status($delivery_data->column, $delivery_data->value, $delivery_data->delivery_id)) {
                $delivery_status = "";
                if ($delivery_data->column === "actual_arrival") {
                    if (date($delivery_data->value) <= date($delivery_data->target_arrival)) {
                        $delivery_status = "on time";
                    } else {
                        $delivery_status = "delayed";
                    }
                    echo $delivery->update_delivery_status("status", $delivery_status, $delivery_data->delivery_id) ? 1 : 0;
                }
            }
        }
        break;
}
