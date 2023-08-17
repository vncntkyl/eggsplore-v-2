<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: *");
require "../config/financialController.php";
$financial = new Financials();

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        if ($_GET['retrieve'] === "monthly income") {
            echo json_encode($financial->retrieve_monthly_income());
        } else if ($_GET['retrieve'] === "sales") {
            $start = $_GET['start_date'];
            $end = $_GET['end_date'];
            echo json_encode($financial->retrieve_sales_from_date($start, $end));
        }
        break;
    case "POST":
        if ($_POST['create_income']) {
            $income_statement = $_POST['create_income'];
            var_dump($income_statement);
            $income_data = array();
            foreach ($income_statement as $inc) {
                array_push($income_data, $inc);
            }
            var_dump($income_data);
        }
        break;
}
