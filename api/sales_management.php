<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/salesController.php";
$sales = new Sales();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $retrieve_type = $_GET['retrieve'];
        switch ($retrieve_type) {
            case "sales_invoice_logs":
                $filter = isset($_GET['filter']) ? (gettype($_GET['filter']) == "object" ? json_decode($_GET['filter']) : $_GET['filter']) : "all";
                echo json_encode($sales->retrieveSalesInvoice($filter));
                break;
            case "latest_invoice":
                echo json_encode($sales->retrieveLatestInvoice());
                break;
            case "invoice_items":
                $sales_id = $_GET['sales_id'] !== 0 ? $_GET['sales_id'] : null;
                echo json_encode($sales->retrieveInvoiceItems($sales_id));
                break;
            case "egg_sales":
                echo json_encode($sales->retrieveEggSales());
                break;
            case "eggs_sold":
                $week = $_GET['week'];
                echo json_encode($sales->retrieveEggsSold($week));
                break;
            case "delivery_invoice":
                $dispatch_id = $_GET['dispatch_id'];
                echo json_encode($sales->retrieveDeliveryInvoice($dispatch_id));
                break;
            case "invoice_for_dispatch":
                echo json_encode($sales->retrieveSalesInvoiceForDispatch());
                break;
            case "dispatch_invoices":
                echo json_encode($sales->retrieveInvoicesForDelivery($_GET['delivery_id']));
                break;
            case "edit_invoices":
                echo json_encode($sales->retrieveAssignedSalesInvoices($_GET['delivery_id']));
                break;
            case "sales_overview":
                echo json_encode($sales->retrieveEggSalesOverview());
                break;
            case "sales_summary_report":
                echo json_encode($sales->retrieveSalesSummaryReport($_GET['start'], $_GET['end']));
                break;
        }
        break;
    case "POST":
        $method = $_POST['method'];
        switch ($method) {
            case "create_invoice":
                $invoice = json_decode($_POST['invoice_data']);
                echo $sales->createSalesInvoice($invoice) ? 1 : 0;
                break;
        }
        break;
    case "PUT":
        $sales_data = json_decode(file_get_contents('php://input'));
        if (isset($sales_data->data)) {
            $data = $sales_data->data;
            echo $sales->updateSalesInvoice($data) ? 1 : 0;
        }
        break;
}
