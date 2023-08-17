<?php
require_once 'authController.php';
class Financials extends Controller
{
    function retrieve_monthly_income()
    {
        try {

            $this->setStatement("SELECT");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieve_sales_from_date($start_date, $end_date)
    {
        try {
            $sql = "SELECT egg_sales,
                        SUM(medicine_cost) + SUM(feed_cost) as medicine_and_feeds_cost,
                        expenses
                    FROM
                        (SELECT SUM(sit.total_amount) AS egg_sales
                        FROM ep_sales_items AS sit
                        JOIN ep_sales_invoice AS sin ON sin.sales_id = sit.sales_id
                        WHERE DATE(sin.date) <= DATE(:end) AND DATE(sin.date) >= DATE(:start)) AS egg_sales_subquery,
                        
                        (SELECT SUM(amount) AS medicine_cost
                        FROM ep_medicine_inventory
                        WHERE DATE(log_date) <= DATE(:end) AND DATE(log_date) >= DATE(:start)) AS medicine_cost_subquery,
                        
                        (SELECT SUM(amount) AS feed_cost
                        FROM ep_feeds_inventory
                        WHERE DATE(log_date) <= DATE(:end) AND DATE(log_date) >= DATE(:start)) AS feed_cost_subquery,
                        
                        (SELECT SUM(driver_expense + assistant_driver_expense + parking_expense + food_expense + gas_expense + toll_gate_expense + tenor_and_load_expense) AS expenses
                        FROM ep_delivery_monitoring
                        WHERE DATE(log_date) <= DATE(:end) AND DATE(log_date) >= DATE(:start)) AS expenses_subquery;";
            $this->setStatement($sql);
            $this->statement->execute([":start" => $start_date, ":end" => $end_date]);
            return $this->statement->fetch();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function create_income_statement($income_statement)
    {
        try {
            $this->setStatement("INSERT INTO `ep_income_statements`(`start_date`, `end_date`, `egg_sales`, `feeds_and_medicine`, `labor`, 
            `other_direct_cost`, `total_cost_of_goods_sold`, `gross_profit`, `transport_and_logistics`, `rent_and_utilities`, `insurance`, 
            `repairs_and_maintenance`, `salaries_and_wages`, `other_operating_expenses`, `total_operating_cost`, `net_income_before_tax`, 
            `taxes`, `net_income`, `log_date`) 
            VALUES (?',?',?',?',?',?',?',?',?',?',?',?',?',?',?',?',?',?',?')");
            $this->statement->execute($income_statement);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
