<?php
require_once 'authController.php';
class Sales extends Controller
{
    function retrieveSalesInvoice($filter = "all")
    {
        try {
            $sqlStatement = "SELECT * FROM ep_sales_invoice ";
            if ($filter !== 'all') {
                if ($filter === 'this_month') {
                    $sqlStatement .= " WHERE MONTH(date) = MONTH(NOW()) ORDER BY date DESC";
                } else {
                    $filter = json_decode($filter);
                    $sqlStatement .= " WHERE date >= '" . $filter->start_date . "' AND date <= '" . $filter->end_date . "' ORDER BY date DESC";
                }
            } else {
                $sqlStatement .= " ORDER BY date DESC";
            }
            $this->setStatement($sqlStatement);
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveLatestInvoice()
    {
        try {
            $this->setStatement("SELECT * FROM ep_sales_invoice WHERE DATE(date) = DATE(NOW()) ORDER BY date DESC LIMIT 1");
            $this->statement->execute();
            return $this->statement->fetch();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function createSalesInvoice($data)
    {
        try {
            $this->setStatement("INSERT INTO ep_sales_invoice (date, invoice_no, customer, location, amount)
            VALUES (?, ?, ?, ?, ?);");
            if ($this->statement->execute([
                $data->date,
                $data->invoice_no,
                $data->customer,
                $data->location,
                $data->amount
            ])) {
                $status = array();
                $sales_id = $this->connection->lastInsertId();
                foreach ($data->items as $item) {
                    if ($this->insertInvoiceItem($sales_id, str_replace("_", " ", $item->item), $item->quantity, $item->price, $item->total)) {
                        array_push($status, 1);
                    } else {
                        array_push($status, 0);
                    }
                }
                return !in_array(0, $status);
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateSalesInvoice($data)
    {
        try {
            $this->setStatement("UPDATE ep_sales_invoice SET date = ?, customer = ?, location = ?, amount = ? WHERE sales_id = ?");
            if ($this->statement->execute([
                $data->date,
                $data->customer,
                $data->location,
                $data->amount,
                $data->sales_id
            ])) {
                $status = array();
                $sales_id = $data->sales_id;

                $invoiceItems = $this->retrieveInvoiceItems($sales_id);

                foreach ($invoiceItems as $invoiceItem) {
                    $itemExists = false;
                    foreach ($data->items as $item) {
                        if (isset($item->item_id) && $invoiceItem->item_id == $item->item_id) {
                            $itemExists = true;
                            break;
                        }
                    }

                    if (!$itemExists) {
                        //delete
                        if ($this->deleteInvoiceItem($invoiceItem->item_id)) {
                            array_push($status, 1);
                        } else {
                            array_push($status, 0);
                        }
                    }
                }
                foreach ($data->items as $item) {
                    if (!isset($item->item_id)) {
                        //insert
                        if ($this->insertInvoiceItem($sales_id, str_replace("_", " ", $item->item_name), $item->quantity, $item->price, $item->total_amount)) {
                            array_push($status, 1);
                        } else {
                            array_push($status, 0);
                        }
                    } else {
                        //update   
                        if ($this->updateInvoiceItem($item)) {
                            array_push($status, 1);
                        } else {
                            array_push($status, 0);
                        }
                    }
                }

                return !in_array(0, $status);
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function insertInvoiceItem($sales_id, $item_name, $qty, $price, $amount)
    {
        try {
            $this->setStatement("INSERT INTO ep_sales_items (sales_id, item_name, quantity, price, total_amount)
            VALUES (?, ?, ?, ?, ?)");
            if ($this->statement->execute([
                $sales_id,
                $item_name,
                $qty,
                $price,
                $amount
            ])) {
                $this->setStatement("BEGIN;

                SET @egg_count = (SELECT et.egg_type_total_count as count FROM ep_egg_types as et WHERE et.egg_type_name = :name);
                
                UPDATE ep_egg_types SET egg_type_total_count = @egg_count - :count WHERE egg_type_name = :name;
                
                COMMIT;");
                return $this->statement->execute([":name" => $item_name, ":count" => $qty]);
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveInvoiceItems($sales_id = null)
    {
        try {
            if ($sales_id) {
                $this->setStatement("SELECT * FROM ep_sales_items WHERE sales_id = ?");
                $this->statement->execute([$sales_id]);
                return $this->statement->fetchAll();
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateInvoiceItem($data)
    {
        try {
            $this->setStatement("UPDATE ep_sales_items SET item_name = ?, quantity = ?, price = ?, total_amount = ? WHERE item_id = ?");
            return $this->statement->execute([
                $data->item_name,
                $data->quantity,
                $data->price,
                $data->total_amount,
                $data->item_id
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteInvoiceItem($item_id)
    {
        try {
            $this->setStatement("DELETE FROM ep_sales_items WHERE item_id = ?");
            return $this->statement->execute([$item_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveInvoicesForDelivery($delivery_id)
    {
        try {
            $this->setStatement("SELECT * FROM ep_sales_invoice WHERE delivery_id = ?");
            $this->statement->execute([$delivery_id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggSales()
    {
        try {
            $this->setStatement("SELECT sin.date as date, SUM(sit.quantity) as sold, SUM(sit.total_amount) as profit 
            FROM ep_sales_items AS sit 
            LEFT JOIN ep_sales_invoice AS sin ON sit.sales_id = sin.sales_id 
            GROUP BY WEEK(sin.date) ORDER BY WEEK(sin.date) DESC");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggSalesOverview()
    {
        try {
            $this->setStatement("WITH AllMonths AS (
                SELECT 1 AS month
                UNION SELECT 2
                UNION SELECT 3
                UNION SELECT 4
                UNION SELECT 5
                UNION SELECT 6
                UNION SELECT 7
                UNION SELECT 8
                UNION SELECT 9
                UNION SELECT 10
                UNION SELECT 11
                UNION SELECT 12
            )
            
            SELECT
                AllMonths.month AS date,
                COALESCE(SUM(sit.total_amount), 0) as profit
            FROM
                AllMonths
            LEFT JOIN
                ep_sales_invoice AS sin ON MONTH(sin.date) = AllMonths.month
            LEFT JOIN
                ep_sales_items AS sit ON sin.sales_id = sit.sales_id
            GROUP BY
                AllMonths.month
            ORDER BY
                AllMonths.month ASC;
            ");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveSalesSummaryReport($start, $end)
    {
        try {
            $this->setStatement("SELECT
            YEAR(sin.date) AS year,
            MONTH(sin.date) AS month,
            COALESCE(SUM(sit.total_amount),
            0) AS profit
        FROM
            ep_sales_invoice AS SIN
        LEFT JOIN ep_sales_items AS sit
        ON
            sin.sales_id = sit.sales_id
        WHERE
            DATE(sin.date) >= DATE(:start_date) AND DATE(sin.date) <= DATE(:end_date)");
            $this->statement->execute([":start_date" => $start, ":end_date" => $end]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggsSold($week)
    {
        try {
            $this->setStatement("SELECT
            et.egg_type_name,
            SUM(COALESCE(sit.quantity, 0)) AS total_quantity,
            SUM(COALESCE(sit.total_amount, 0)) AS total_amount
        FROM
            ep_egg_types AS et
        LEFT JOIN
            (
                SELECT
                    sit.item_name,
                    sit.quantity,
                    sit.total_amount,
                    sit.sales_id
                FROM
                    ep_sales_items AS sit
                LEFT JOIN
                    ep_sales_invoice AS sin ON sit.sales_id = sin.sales_id
                WHERE WEEK(sin.date) = :week
            ) AS sit ON et.egg_type_name = sit.item_name
        GROUP BY
            et.egg_type_name;");
            $this->statement->execute([":week" => $week]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveSalesInvoiceForDispatch()
    {
        try {
            $this->setStatement("SELECT * FROM ep_sales_invoice WHERE delivery_id IS NULL");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveDeliveryInvoice($dispatch_id)
    {
        try {
            $this->setStatement("SELECT * FROM ep_sales_invoice WHERE delivery_id = ?");
            $this->statement->execute([$dispatch_id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
