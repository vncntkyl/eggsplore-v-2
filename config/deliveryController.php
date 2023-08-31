<?php
require_once 'authController.php';
require_once 'salesController.php';
class Delivery extends Controller
{
    function retrieve_delivery_monitoring($filter = "all")
    {
        try {
            $sqlStatement = "SELECT * FROM ep_delivery_monitoring ";
            if ($filter !== 'all') {
                if ($filter === 'today') {
                    $sqlStatement .= " WHERE DATE(log_date) = DATE(NOW()) ORDER BY log_date DESC";
                } else if ($filter === 'yesterday') {
                    $sqlStatement .= " WHERE DATE(log_date) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)) ORDER BY log_date DESC";
                } else if ($filter === 'this_week') {
                    $sqlStatement .= " WHERE WEEK(log_date) = WEEK(NOW()) ORDER BY log_date DESC";
                } else if ($filter === 'this_month') {
                    $sqlStatement .= " WHERE MONTH(log_date) = MONTH(NOW()) ORDER BY log_date DESC";
                } else {
                    $filter = json_decode($filter);
                    $sqlStatement .= " WHERE log_date >= '" . $filter->start_date . "' AND log_date <= '" . $filter->end_date . "' ORDER BY log_date DESC";
                }
            } else {
                $sqlStatement .= " ORDER BY log_date DESC";
            }
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function insert_delivery_monitoring($delivery_data)
    {
        try {
            $sqlStatement = "SET @current_date = DATE_FORMAT(NOW(), '%y%m%d');
            SET @min_dispatch_id = CONVERT(CONCAT(@current_date, '-00') USING utf8mb4);
            SET @max_dispatch_id = CONVERT(CONCAT(@current_date, '-99') USING utf8mb4);
            SELECT MAX(SUBSTRING(dispatch_id,2)) AS latest INTO @latest_dispatch_id
            FROM ep_delivery_monitoring
            WHERE SUBSTRING(dispatch_id,2) >= @min_dispatch_id AND SUBSTRING(dispatch_id,2) <= @max_dispatch_id;
            SET @latest_dispatch_id = IFNULL(@latest_dispatch_id, CONCAT(@current_date, '-00'));
            SET @next_dispatch_id = CONCAT('D', @current_date, '-', LPAD(SUBSTRING(@latest_dispatch_id, 8) + 1, 2, '0'));
            SELECT @next_dispatch_id;

            INSERT INTO ep_delivery_monitoring (dispatch_id, location, departure_date, target_arrival, driver_name, assistant_driver_name,
            driver_expense, assistant_driver_expense, parking_expense, food_expense, gas_expense, toll_gate_expense, tenor_and_load_expense, log_date)
            VALUES (@next_dispatch_id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
            $this->setStatement($sqlStatement);
            $this->statement->execute($delivery_data);

            $sqlStatement = "SELECT delivery_id FROM ep_delivery_monitoring ORDER BY log_date DESC LIMIT 1";
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            return $this->statement->fetch()->delivery_id;
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_delivery_status($column, $value, $id)
    {
        try {
            $this->setStatement("UPDATE ep_delivery_monitoring SET " . $column . " = ? WHERE dispatch_id = ?");
            return $this->statement->execute([$value, $id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_delivery_information($delivery_data)
    {
        try {
            $this->setStatement("UPDATE ep_delivery_monitoring SET location = ?, departure_date = ?, target_arrival = ?, driver_name = ?, assistant_driver_name = ?,
            driver_expense = ?, assistant_driver_expense = ?, parking_expense = ?, food_expense = ?, gas_expense = ?, toll_gate_expense = ?, tenor_and_load_expense = ?
                         WHERE delivery_id = ?");
            return $this->statement->execute($delivery_data);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function insertSalesDeliveryInvoice($delivery_id, $sales_id)
    {
        try {
            $this->setStatement("UPDATE ep_sales_invoice SET delivery_id = ? WHERE sales_id = ?");
            return $this->statement->execute([$delivery_id, $sales_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteSalesDeliveryInvoice($sales_id)
    {
        try {
            $this->setStatement("UPDATE ep_sales_invoice SET delivery_id = NULL WHERE sales_id = ?");
            return $this->statement->execute([$sales_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateSalesDeliveryInvoice($delivery_id, $invoices)
    {
        $sales = new Sales();
        $status = array();
        try {
            $deliveryInvoices = $sales->retrieveInvoicesForDelivery($delivery_id);
            foreach ($deliveryInvoices as $deliveryInvoice) {
                $itemExists = false;
                foreach ($invoices as $invoice) {
                    if (isset($invoice->sales_id) && $deliveryInvoice->sales_id == $invoice->sales_id) {
                        $itemExists = true;
                        break;
                    }
                }
                if (!$itemExists) {
                    if ($this->deleteSalesDeliveryInvoice($deliveryInvoice->sales_id)) {
                        array_push($status, 1);
                    } else {
                        array_push($status, 0);
                    }
                }
            }
            foreach ($invoices as $invoice) {
                if ($this->insertSalesDeliveryInvoice($delivery_id, $invoice->sales_id)) {
                    array_push($status, 1);
                } else {
                    array_push($status, 0);
                }
            }
            return !in_array(0, $status);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
