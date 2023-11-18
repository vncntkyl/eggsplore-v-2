<?php
require_once 'authController.php';
class Egg extends Controller
{

    function procureEgg($egg_data, $building_no)
    {
        try {
            $this->setStatement("SET @current_date = DATE_FORMAT(NOW(), '%y%m%d');
            SET @building_number = " . $building_no . "; 
            SET @min_batch_number = CONVERT(CONCAT(@current_date, '-', @building_number, '-00') USING utf8mb4);
            SET @max_batch_number = CONVERT(CONCAT(@current_date, '-', @building_number, '-99') USING utf8mb4);

            SELECT
                    MAX(batch_id) AS latest
            INTO @latest_batch_number
            FROM
                ep_egg_production
            WHERE
                batch_id >= @min_batch_number AND batch_id <= @max_batch_number;

            SET @latest_batch_number = COALESCE(@latest_batch_number, CONCAT(@current_date, '-', @building_number, '-00'));
            SET @next_batch_number = CONCAT(@current_date, '-', @building_number, '-', LPAD(SUBSTRING(@latest_batch_number, 10) + 1, 2, '0'));
            INSERT INTO ep_egg_production (date_produced, batch_id, egg_count,egg_tray_count, soft_shell_count,soft_shell_tray_count, crack_count, crack_tray_count, building_id, user_id, log_date) 
            VALUES (?,@next_batch_number, ?,?,?,?,?,?,?,?,?)
            ");
            return $this->statement->execute([
                $egg_data->date,
                $egg_data->egg,
                $egg_data->egg_tray,
                $egg_data->soft_shell,
                $egg_data->soft_shell_tray,
                $egg_data->crack,
                $egg_data->crack_tray,
                $egg_data->building,
                $egg_data->staff,
                $egg_data->log_date
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggOverview()
    {
        try {
            $this->setStatement("SELECT
            bldg.id,
            ep.batch_id,
            bldg.number,
            COALESCE(ep.egg_count, 0) + COALESCE(ep.egg_tray_count, 0) + COALESCE(ep.soft_shell_count, 0) +
            COALESCE(ep.soft_shell_tray_count, 0) + COALESCE(ep.crack_count, 0) + COALESCE(ep.crack_tray_count, 0) AS egg_count
        FROM
            ep_building AS bldg
        LEFT JOIN ep_egg_production AS ep
        ON
            bldg.id = ep.building_id AND DATE(ep.date_produced) = CURDATE();");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggInventoryOverview()
    {
        try {
            $this->setStatement("WITH
            Weeks AS(
            SELECT DISTINCT
                WEEK(date_produced) AS 'week'
            FROM
                ep_egg_production
            UNION
        SELECT DISTINCT
            WEEK(DATE) AS 'week'
        FROM
            ep_sales_invoice
        )
        SELECT
            Weeks.week AS 'date',
            COALESCE(ep.produced, 0) AS 'produced',
            COALESCE(sin.sold, 0) AS 'sold'
        FROM
            Weeks
        LEFT JOIN(
            SELECT
                ep.year AS 'year',
                ep.week AS 'week',
                COALESCE(SUM(ep.egg_count),
                0) + COALESCE(SUM(epr.quantity),
                0) AS 'produced'
            FROM
                (
                SELECT
                    YEAR(date_produced) AS 'year',
                    WEEK(date_produced) AS 'week',
                    COALESCE(egg_count, 0) + COALESCE(egg_tray_count, 0) + COALESCE(soft_shell_count, 0) +
            COALESCE(soft_shell_tray_count, 0) + COALESCE(crack_count, 0) + COALESCE(crack_tray_count, 0) AS egg_count
                FROM
                    ep_egg_production
                GROUP BY
                    WEEK(date_produced)
            ) AS ep
        LEFT JOIN(
            SELECT YEAR(date_procured) AS 'year',
                WEEK(date_procured) AS 'week',
                SUM(quantity) AS 'quantity'
            FROM
                ep_egg_procurement
            GROUP BY
                WEEK(date_procured)
        ) AS epr
        ON
            ep.week = epr.week
        GROUP BY
            WEEK
        ORDER BY
            YEAR
        DESC
            ,
            WEEK
        DESC
        ) AS ep
        ON
            Weeks.week = ep.week
        LEFT JOIN(
            SELECT
                WEEK(DATE) AS 'week',
                SUM(quantity) AS 'sold'
            FROM
                ep_sales_items AS sit
            LEFT JOIN ep_sales_invoice AS sin
            ON
                sit.sales_id = sin.sales_id
            GROUP BY
                WEEK(DATE)
        ) AS sin
        ON
            Weeks.week = sin.week
        ORDER BY
            'date'
        DESC;");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    // not done yet //
    function retrieveEggProductionReport($start, $end)
    {
        try {
            $this->setStatement("SELECT
            b.number AS building_no,
            COALESCE(SUM(ep.egg_count), 0) AS produced_eggs,
            COALESCE(SUM(ep.defect_count), 0) AS defect_eggs
        FROM
            ep_building AS b
        LEFT JOIN
            ep_egg_production AS ep ON b.id = ep.building_id
        WHERE
            DATE(ep.date_produced) >= DATE(:start_date) AND DATE(ep.date_produced) <= DATE(:end_date)
        GROUP BY
            b.id;");
            $this->statement->execute([":start_date" => $start, ":end_date" => $end]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    // not done yet //
    function retrieveEggProductionAndSalesReport($start, $end)
    {
        try {
            $this->setStatement("WITH ep_months AS (SELECT DISTINCT
                                MONTH(date_produced) AS 'month'
                            FROM
                                ep_egg_production
                                WHERE date_produced >= :start_date AND date_produced <= :end_date
                            UNION
                        SELECT DISTINCT
                            MONTH(date) AS 'month'
                        FROM
                            ep_sales_invoice
                            WHERE date >= :start_date AND date <= :end_date)
                            SELECT ep_months.month,
                            COALESCE(ep.produced,0) AS eggs_produced,
                            COALESCE(sin.sold,0) AS eggs_sold
                            FROM
                            ep_months
                            LEFT JOIN (
                    SELECT
                    ep.year AS 'year',
                    ep.month AS 'month',
                    COALESCE(SUM(ep.egg_count), 0) + COALESCE(SUM(epr.quantity), 0) AS 'produced'
                    FROM
                    (
                        SELECT
                            YEAR(date_produced) AS 'year',
                            MONTH(date_produced) AS 'month',
                            SUM(egg_count) AS 'egg_count'
                        FROM
                            ep_egg_production
                            WHERE date_produced >= :start_date AND date_produced <= :end_date
                        GROUP BY
                            MONTH(date_produced)
                    ) AS ep
                    LEFT JOIN
                    (
                        SELECT
                        YEAR(date_procured) AS 'year',
                            MONTH(date_procured) AS 'month',
                            SUM(quantity) AS 'quantity'
                        FROM
                            ep_egg_procurement
                            WHERE date_procured >= :start_date AND date_procured <= :end_date
                        GROUP BY
                            MONTH(date_procured)
                    ) AS epr
                    ON
                    ep.month = epr.month
                    GROUP BY month
                    ORDER BY
                    year DESC,
                    month DESC
                            ) AS ep
                    ON ep_months.month = ep.month
                    LEFT JOIN (
                    SELECT
                                MONTH(sin.date) AS 'month',
                                SUM(quantity) AS 'sold'
                            FROM
                                ep_sales_items AS sit
                            LEFT JOIN ep_sales_invoice AS sin
                            ON
                                sit.sales_id = sin.sales_id
                            WHERE sin.date >= :start_date AND sin.date <= :end_date
                            GROUP BY
                                MONTH(sin.date)
                    ) AS sin
                    ON ep_months.month = sin.month
                    ORDER BY sin.month DESC;");
            $this->statement->execute([":start_date" => $start, ":end_date" => $end]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggProduction($filter = "all")
    {
        try {
            $sqlStatement = "SELECT * FROM ep_egg_production ";
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
    //not done yet //
    function updateEggProduction($egg_count, $defect_count, $production_id)
    {
        try {
            $this->setStatement("UPDATE ep_egg_production SET egg_count = ?, defect_count = ? WHERE egg_production_id = ?");
            return $this->statement->execute([$egg_count, $defect_count, $production_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    //EGG SEGREGATION FUNCTIONS

    function retrieveEggsForSegregation()
    {
        try {
            $this->setStatement("SELECT
            COALESCE(ep.total_egg_pieces, 0) - COALESCE(seg.total_egg_pieces, 0) AS egg_pieces,
            COALESCE(ep.total_egg_trays, 0) - COALESCE(seg.total_egg_trays, 0) AS egg_trays
        FROM
            (
                SELECT
                    SUM(COALESCE(egg_count, 0)) AS total_egg_pieces,
                    SUM(COALESCE(egg_tray_count, 0)) AS total_egg_trays
                FROM
                    ep_egg_production
            ) AS ep
        CROSS JOIN
            (
                SELECT
                    SUM(COALESCE(no_weight, 0) + COALESCE(pewee, 0) + COALESCE(pullet, 0) +
                        COALESCE(brown, 0) + COALESCE(small, 0) + COALESCE(medium, 0) +
                        COALESCE(large, 0) + COALESCE(extra_large, 0) + COALESCE(jumbo, 0)) AS total_egg_pieces,
                    SUM(COALESCE(no_weight_tray, 0) + COALESCE(pewee_tray, 0) + COALESCE(pullet_tray, 0) +
                        COALESCE(brown_tray, 0) + COALESCE(small_tray, 0) + COALESCE(medium_tray, 0) +
                        COALESCE(large_tray, 0) + COALESCE(extra_large_tray, 0) + COALESCE(jumbo_tray, 0)) AS total_egg_trays
                FROM
                    ep_egg_segregation
            ) AS seg;
        ");
            $this->statement->execute([]);
            return $this->statement->fetch();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggSegregationLogs($staff_id)
    {
        try {
            $this->setStatement("SELECT * FROM ep_egg_segregation WHERE user_id = ? ORDER BY log_date DESC");
            $this->statement->execute([$staff_id]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveEggClasifications()
    {
        try {
            $this->setStatement("SELECT * FROM ep_egg_types");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function segregateEggProduction($data)
    {
        try {
            $this->setStatement("INSERT INTO ep_egg_segregation (production_id, no_weight, pewee, pullet, brown, small, medium, large, extra_large, jumbo, crack, soft_shell, user_id, log_date)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            if ($this->statement->execute([
                $data->production_id,
                $data->no_weight,
                $data->pewee,
                $data->pullet,
                $data->brown,
                $data->small,
                $data->medium,
                $data->large,
                $data->extra_large,
                $data->jumbo,
                $data->crack,
                $data->soft_shell,
                $data->user_id,
                $data->log_date,
            ])) {
                $status = array();
                unset($data->production_id);
                unset($data->user_id);
                unset($data->log_date);

                $objectVars = get_object_vars($data);
                foreach ($objectVars as $key => $value) {
                    $this->updateEggClassifications($value, str_replace('_', ' ', $key)) ? array_push($status, 1) : array_push($status, 0);
                }

                if (in_array(0, $status)) {
                    return 0;
                } else {
                    return 1;
                }
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateEggClassifications($count, $classification)
    {
        try {
            $this->setStatement("BEGIN;

            SET @egg_count = (SELECT et.egg_type_total_count as count FROM ep_egg_types as et WHERE et.egg_type_name = :name);
            
            UPDATE ep_egg_types SET egg_type_total_count = @egg_count + :count WHERE egg_type_name = :name;
            
            COMMIT;");
            return $this->statement->execute([":count" => $count, ":name" => $classification]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function procureBrownEgg($data)
    {
        try {
            $this->setStatement("INSERT INTO ep_egg_procurement (egg_type,quantity,supplier,amount,date_procured,log_date) 
            VALUES (?,?,?,?,?,?)");
            if ($this->statement->execute([
                $data->egg_type,
                $data->quantity,
                $data->supplier,
                $data->amount,
                $data->date_procured,
                $data->log_date,
            ])) {
                return $this->updateEggClassifications($data->quantity, str_replace('_', ' ', $data->egg_type));
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateProcurement($data)
    {
        try {
            $this->setStatement("BEGIN;
            SET @qty = (SELECT quantity as qty FROM ep_egg_procurement WHERE egg_procurement_id = :proc_id);
            SET @eggQty = (SELECT egg_type_total_count as eggQty FROM ep_egg_types WHERE egg_type_name = :egg_type);
            
            UPDATE `ep_egg_procurement` SET `egg_type`= :egg_type,`quantity`= :qty,`supplier`= :supplier,`amount`= :amt WHERE `egg_procurement_id` = :proc_id;
            UPDATE ep_egg_types SET egg_type_total_count = (@eggQty - @qty) + :qty WHERE egg_type_name = :egg_type;
            COMMIT;
            ");
            return $this->statement->execute([
                ":egg_type" => $data->egg_type,
                ":qty" => $data->quantity,
                ":supplier" => $data->supplier,
                ":amt" => $data->amount,
                ":proc_id" => $data->egg_procurement_id,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveProcurement($filter)
    {
        try {
            $sqlStatement = "SELECT * FROM ep_egg_procurement ";
            if ($filter !== 'all') {
                if ($filter === 'this_month') {
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

    function retrieveEggsInventory()
    {
        try {
            $this->setStatement("SELECT
            production_eggs.week,
             COALESCE(production_eggs.total_eggs, 0) + COALESCE(procurement_eggs.total_eggs, 0) AS total_combined_eggs
        FROM (
            SELECT WEEK(log_date) AS week, (SUM(egg_count) + SUM(defect_count)) AS total_eggs
            FROM ep_egg_production
            GROUP BY WEEK(log_date)
        ) AS production_eggs
        LEFT JOIN (
            SELECT WEEK(log_date) AS week, SUM(quantity) AS total_eggs
            FROM ep_egg_procurement
            GROUP BY WEEK(log_date)
        ) AS procurement_eggs ON production_eggs.week = procurement_eggs.week ORDER BY production_eggs.week DESC;");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveSegregatedEggs($start, $end)
    {
        try {
            $this->setStatement("SELECT
            COALESCE(SUM(ep.egg_count) + SUM(ep.defect_count),0) as eggs,
            COALESCE(SUM(es.no_weight),0) AS no_weight, 
            COALESCE(SUM(es.pewee),0) AS pewee,
            COALESCE(SUM(es.pullet),0) AS pullet,
            COALESCE(SUM(es.brown),0) AS brown,
            COALESCE(SUM(es.small),0) AS small,
            COALESCE(SUM(es.medium),0) AS 'medium',
            COALESCE(SUM(es.large),0) AS large,
            COALESCE(SUM(es.extra_large),0) AS extra_large,
            COALESCE(SUM(es.jumbo),0) AS jumbo,
            COALESCE(SUM(es.crack),0) AS crack,
            COALESCE(SUM(es.soft_shell),0) AS soft_shell
            FROM ep_egg_production AS ep
            LEFT JOIN ep_egg_segregation AS es ON es.production_id = ep.batch_id 
            WHERE DATE(ep.date_produced) >= DATE(:start_date) AND DATE(ep.date_produced) <= DATE(:end_date)");
            $this->statement->execute([":start_date" => $start, ":end_date" => $end]);
            return $this->statement->fetch();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveInventoryReport($start, $end)
    {
        try {
            $this->setStatement("WITH
            ep_weeks AS(
            SELECT DISTINCT
                WEEK(date_produced) AS 'week'
            FROM
                ep_egg_production
            WHERE
                date_produced >= :start_date AND date_produced <= :end_date
            UNION
        SELECT DISTINCT
            WEEK(DATE) AS 'week'
        FROM
            ep_sales_invoice
        WHERE
            DATE >= :start_date AND DATE <= :end_date
        )
        SELECT
            ep_weeks.week,
            COALESCE(ep.produced, 0) AS eggs_produced,
            COALESCE(es.total, 0) AS segregated_eggs,
        (
            CASE WHEN COALESCE(ep.produced, 0) > COALESCE(es.total, 0) THEN COALESCE(ep.produced, 0) - COALESCE(es.total, 0) ELSE 0
        END
        ) AS unsegregated_eggs,
        COALESCE(sin.sold, 0) AS eggs_sold,
            (
                CASE WHEN COALESCE(ep.produced, 0) > COALESCE(sin.sold, 0) THEN COALESCE(ep.produced, 0) - COALESCE(sin.sold, 0) ELSE 0
            END
        ) AS remaining_eggs
        FROM
            ep_weeks
        LEFT JOIN(
            SELECT
                ep.year AS 'year',
                ep.week AS 'week',
                COALESCE(SUM(ep.egg_count),
                0) + COALESCE(SUM(epr.quantity),
                0) AS 'produced'
            FROM
                (
                SELECT
                    YEAR(date_produced) AS 'year',
                    WEEK(date_produced) AS 'week',
                    SUM(egg_count) AS 'egg_count'
                FROM
                    ep_egg_production
                WHERE
                    date_produced >= :start_date AND date_produced <= :end_date
                GROUP BY
                    WEEK(date_produced)
            ) AS ep
        LEFT JOIN(
            SELECT
                YEAR(date_procured) AS 'year',
                WEEK(date_procured) AS 'week',
                SUM(quantity) AS 'quantity'
            FROM
                ep_egg_procurement
            WHERE
                date_procured >= :start_date AND date_procured <= :end_date
            GROUP BY
                WEEK(date_procured)
        ) AS epr
        ON
            ep.week = epr.week
        GROUP BY
            WEEK
        ORDER BY
            WEEK
        ASC
        ) AS ep
        ON
            ep_weeks.week = ep.week
        LEFT JOIN(
            SELECT
                WEEK(sin.date) AS 'week',
                SUM(quantity) AS 'sold'
            FROM
                ep_sales_items AS sit
            LEFT JOIN ep_sales_invoice AS sin
            ON
                sit.sales_id = sin.sales_id
            WHERE
                sin.date >= :start_date AND sin.date <= :end_date
            GROUP BY
                WEEK(sin.date)
        ) AS sin
        ON
            ep_weeks.week = sin.week
        LEFT JOIN(
            SELECT
                WEEK(es.log_date) AS 'week',
                COALESCE(SUM(es.no_weight),
                0) + COALESCE(SUM(es.pewee),
                0) + COALESCE(SUM(es.pullet),
                0) + COALESCE(SUM(es.brown),
                0) + COALESCE(SUM(es.small),
                0) + COALESCE(SUM(es.medium),
                0) + COALESCE(SUM(es.large),
                0) + COALESCE(SUM(es.extra_large),
                0) + COALESCE(SUM(es.jumbo),
                0) + COALESCE(SUM(es.crack),
                0) + COALESCE(SUM(es.soft_shell),
                0) AS total
            FROM
                ep_egg_segregation AS es
            WHERE
                DATE(es.log_date) >= :start_date AND DATE(es.log_date) <= :end_date
            GROUP BY
                WEEK(es.log_date)
        ) AS es
        ON
            ep_weeks.week = es.week
        ORDER BY
            sin.week
        ASC
            ;");
            $this->statement->execute([":start_date" => $start, ":end_date" => $end]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
