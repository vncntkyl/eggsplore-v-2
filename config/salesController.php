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
}
