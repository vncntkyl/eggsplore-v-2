<?php
require_once 'authController.php';
class Feeds extends Controller
{
    function retrieve_feeds($id = "all")
    {
        try {
            $statement = $id === "all" ? "SELECT * FROM ep_feeds" : "SELECT * FROM ep_feeds WHERE id = ?";
            $this->setStatement($statement);
            if ($id !== "all") {
                $this->statement->execute([$id]);
                return $this->statement->fetch();
            } else {
                $this->statement->execute();
                return $this->statement->fetchAll();
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function addFeeds($name, $description)
    {
        try {
            $this->setStatement("INSERT INTO ep_feeds (name, description) VALUES (?,?)");
            return $this->statement->execute([$name, $description]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function updateFeeds($feeds)
    {
        try {
            $this->setStatement("UPDATE ep_feeds SET name = ?, description = ? WHERE id = ?");
            return $this->statement->execute([$feeds->name, $feeds->description, $feeds->id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function deleteFeeds($feeds_id)
    {
        try {
            $this->setStatement("DELETE FROM ep_feeds WHERE id = ?");
            return $this->statement->execute([$feeds_id]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    //FEEDS CONSUMPTION
    function retrieve_feeds_consumption($id = "all")
    {
        try {
            $statement = "SELECT * FROM ep_feeds_consumption ";
            if ($id !== "all") {
                $statement .= "WHERE feed_1 = ?";
            }
            $this->setStatement($statement . " ORDER BY id DESC");
            if ($id !== "all") {
                $this->statement->execute([$id]);
                return $this->statement->fetch();
            } else {
                $this->statement->execute();
                return $this->statement->fetchAll();
            }
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function add_feeds_consumption($consumption_data)
    {
        try {
            $this->setStatement("INSERT INTO ep_feeds_consumption (feed_id, consumed, disposed, remaining, remarks, date_procured, staff_id, building_id, log_date)
             VALUES (?,?,?,?,?,?,?,?,?)");
            return $this->statement->execute([
                $consumption_data->feed_id,
                $consumption_data->consumed,
                $consumption_data->disposed,
                $consumption_data->remaining,
                $consumption_data->remarks,
                $consumption_data->date,
                $consumption_data->staff,
                $consumption_data->building,
                $consumption_data->log_date,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function update_feeds_consumption($consumption_data)
    {
        try {
            $this->setStatement("UPDATE ep_feeds_consumption SET consumed = ?, disposed = ?, remaining = ?, remarks = ? WHERE id = ?");
            return $this->statement->execute([
                $consumption_data->consumed,
                $consumption_data->disposed,
                $consumption_data->remaining,
                $consumption_data->remarks,
                $consumption_data->id,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    //FEEDS INVENTORY
    function retrieve_feeds_inventory($filter)
    {
        try {
            $sqlStatement = "SELECT * FROM ep_feeds_inventory ";
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
    function insert_feeds_inventory($consumption_data)
    {
        try {
            $this->setStatement("INSERT INTO ep_feeds_inventory (feed_id, date_received, quantity, supplier, amount, log_date)
            VALUES (?,?,?,?,?,?)");
            return $this->statement->execute([
                $consumption_data->feeds,
                $consumption_data->date_received,
                $consumption_data->quantity,
                $consumption_data->supplier,
                $consumption_data->amount,
                $consumption_data->log_date,
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }

    function update_feeds_inventory($feed)
    {
        try {
            $this->setStatement("UPDATE ep_feeds_inventory SET feed_id = ?, date_received = ?, quantity = ?, supplier = ?, amount = ?, log_date = ? WHERE id = ?");
            return $this->statement->execute([
                $feed->feed,
                $feed->date_received,
                $feed->quantity,
                $feed->supplier,
                $feed->amount,
                $feed->log_date,
                $feed->id
            ]);
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }

    function get_feed_quantity()
    {
        try {
            $this->setStatement("SELECT i.feed_id,
            COALESCE(i.total_received, 0) - COALESCE(m.total_taken, 0) AS remaining_quantity
            FROM (
                SELECT feed_id, SUM(quantity) AS total_received
                FROM ep_feeds_inventory
                GROUP BY feed_id
            ) i
            LEFT JOIN (
                SELECT feed_id, SUM(disposed + consumed) AS total_taken
                FROM ep_feeds_consumption
                GROUP BY feed_id
            ) m ON i.feed_id = m.feed_id");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveOverviewToday()
    {
        try {
            $this->setStatement("SELECT
            buildings.id,
            buildings.number,
            COALESCE(SUM(fc.consumed),
            0) AS total_consumed,
            COALESCE(SUM(mi.intake),
            0) AS total_intake
        FROM
            ep_building AS buildings
        LEFT JOIN ep_feeds_consumption fc ON
            buildings.id = fc.building_id AND  DATE(fc.date_procured) = CURDATE()
        LEFT JOIN ep_medication_intake mi ON
            buildings.id = mi.building_id AND DATE(mi.date_procured) = CURDATE()
            GROUP BY buildings.id;");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveInventorySummary()
    {

        try {
            $this->setStatement("WITH AllMonths AS( 
                SELECT 1 AS MONTH 
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
                UNION SELECT 12 ) 
                SELECT AllMonths.month AS date, 
                COALESCE(SUM(med.amount) + SUM(feeds.amount), 0) AS cost 
                FROM AllMonths 
                LEFT JOIN ep_medicine_inventory AS med ON MONTH(med.log_date) = AllMonths.month 
                LEFT JOIN ep_feeds_inventory AS feeds ON MONTH(feeds.log_date) = AllMonths.month 
                GROUP BY AllMonths.month ORDER BY AllMonths.month ASC;");
            $this->statement->execute();
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveMaintenanceReport($start_date, $end_date)
    {
        try {
            $this->setStatement("SELECT
            DATE(med.log_date) as month,
            COALESCE(SUM(med.amount), 0) AS medicine_expense,
            COALESCE(SUM(feeds.amount), 0) AS feeds_expense
        FROM
            ep_medicine_inventory AS med
        LEFT JOIN (
            SELECT
                log_date,
                COALESCE(SUM(amount), 0) AS amount
            FROM
                ep_feeds_inventory
            WHERE
                DATE(log_date) >= :start_date AND DATE(log_date) <= :end_date
            GROUP BY
                MONTH(log_date)
        ) AS feeds ON MONTH(feeds.log_date) = MONTH(med.log_date)
        WHERE
            DATE(med.log_date) >= :start_date AND DATE(med.log_date) <= :end_date
        GROUP BY
            MONTH(med.log_date);");
            $this->statement->execute([":start_date" => $start_date, ":end_date" => $end_date]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
    function retrieveFeedsReport($start_date, $end_date)
    {
        try {
            $this->setStatement("SELECT
            DATE_FORMAT(feeds.log_date, '%Y-%m') as month,
            feed.name,
             COALESCE(SUM(feeds.amount),0) AS feeds_expense
                FROM
                        ep_feeds_inventory AS feeds
                    LEFT JOIN
                    ep_feeds as feed ON feeds.feed_id = feed.id
                    WHERE
                        feeds.log_date >= ? AND feeds.log_date <= ?
                GROUP BY
                month,
                feed.name
            ORDER BY
                month, 
                feed.name;");
            $this->statement->execute([$start_date, $end_date]);
            return $this->statement->fetchAll();
        } catch (PDOException $e) {
            $this->getError($e);
        }
    }
}
