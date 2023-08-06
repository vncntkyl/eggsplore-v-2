-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2023 at 02:58 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eggsplore`
--

-- --------------------------------------------------------

--
-- Table structure for table `ep_building`
--

CREATE TABLE `ep_building` (
  `id` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_building`
--

INSERT INTO `ep_building` (`id`, `number`, `capacity`) VALUES
(1, 1, 438),
(2, 2, 1395),
(4, 3, 151);

-- --------------------------------------------------------

--
-- Table structure for table `ep_chicken`
--

CREATE TABLE `ep_chicken` (
  `chicken_id` int(11) NOT NULL,
  `chicken_count` int(11) NOT NULL COMMENT 'total count of chicken',
  `mortality_count` int(11) NOT NULL,
  `missing_count` int(11) NOT NULL,
  `remaining` int(11) NOT NULL,
  `remarks` text NOT NULL,
  `date_procured` date NOT NULL,
  `staff_id` int(11) NOT NULL,
  `building_id` int(11) NOT NULL,
  `log_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_chicken`
--

INSERT INTO `ep_chicken` (`chicken_id`, `chicken_count`, `mortality_count`, `missing_count`, `remaining`, `remarks`, `date_procured`, `staff_id`, `building_id`, `log_date`) VALUES
(1, 100, 6, 2, 92, '', '2023-07-28', 2, 1, '2023-07-28 05:24:37'),
(2, 95, 0, 0, 95, 'added 3 chickens', '2023-07-28', 2, 1, '2023-07-28 05:25:03'),
(3, 100, 0, 0, 100, 'added 100 chickens for building 2', '2023-07-28', 2, 2, '2023-07-28 05:32:08'),
(4, 115, 5, 10, 100, 'added 30 chickens', '2023-07-28', 2, 1, '2023-07-28 05:39:44');

-- --------------------------------------------------------

--
-- Table structure for table `ep_chicks`
--

CREATE TABLE `ep_chicks` (
  `chick_id` int(11) NOT NULL,
  `batch_number` varchar(15) NOT NULL,
  `chick_count` int(11) NOT NULL,
  `supplier` varchar(50) NOT NULL,
  `date_procured` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_chicks`
--

INSERT INTO `ep_chicks` (`chick_id`, `batch_number`, `chick_count`, `supplier`, `date_procured`) VALUES
(1, '230721-001', 326, 'Hi-Chicks Farm', '2023-07-21'),
(2, '230721-002', 255, 'Jethro Farm', '2023-07-21'),
(3, '230721-003', 400, 'United Neon', '2023-07-21'),
(4, '230728-001', 185, 'USTSHS', '2023-07-28'),
(5, '230728-002', 30, 'FEU', '2023-07-28');

-- --------------------------------------------------------

--
-- Table structure for table `ep_egg_production`
--

CREATE TABLE `ep_egg_production` (
  `egg_production_id` int(11) NOT NULL,
  `date_produced` date NOT NULL,
  `egg_count` int(11) NOT NULL,
  `defect_count` int(11) NOT NULL,
  `building_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_egg_production`
--

INSERT INTO `ep_egg_production` (`egg_production_id`, `date_produced`, `egg_count`, `defect_count`, `building_id`, `user_id`, `log_date`) VALUES
(1, '2023-07-05', 125, 0, 2, 2, '2023-07-07 11:23:43'),
(2, '2023-07-07', 250, 0, 1, 2, '2023-07-07 11:56:23'),
(3, '2023-07-07', 165, 0, 1, 2, '2023-07-07 13:19:12'),
(4, '2023-07-04', 180, 0, 1, 2, '2023-07-07 13:38:16'),
(5, '2023-07-19', 250, 0, 1, 9, '2023-07-19 16:38:25'),
(8, '2023-07-19', 314, 0, 4, 9, '2023-07-19 16:53:56'),
(9, '2023-07-12', 145, 0, 2, 9, '2023-07-19 17:29:03'),
(10, '2023-08-05', 4, 0, 1, 2, '2023-08-05 21:42:21'),
(11, '2023-08-05', 1000, 15, 2, 2, '2023-08-05 22:41:02'),
(12, '2023-08-06', 212, 10, 2, 2, '2023-08-06 10:34:36');

-- --------------------------------------------------------

--
-- Table structure for table `ep_egg_segregation`
--

CREATE TABLE `ep_egg_segregation` (
  `segregation_id` int(11) NOT NULL,
  `production_id` int(11) NOT NULL,
  `no_weight` int(11) NOT NULL,
  `pewee` int(11) NOT NULL,
  `pullet` int(11) NOT NULL,
  `brown` int(11) NOT NULL,
  `small` int(11) NOT NULL,
  `medium` int(11) NOT NULL,
  `large` int(11) NOT NULL,
  `extra_large` int(11) NOT NULL,
  `jumbo` int(11) NOT NULL,
  `crack` int(11) NOT NULL,
  `soft_shell` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ep_egg_types`
--

CREATE TABLE `ep_egg_types` (
  `egg_type_id` int(11) NOT NULL,
  `egg_type_name` varchar(11) NOT NULL,
  `egg_type_total_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_egg_types`
--

INSERT INTO `ep_egg_types` (`egg_type_id`, `egg_type_name`, `egg_type_total_count`) VALUES
(1, 'no weight', 0),
(2, 'pewee', 0),
(3, 'pullet', 0),
(4, 'brown', 0),
(5, 'small', 0),
(6, 'medium', 0),
(7, 'large', 0),
(8, 'extra large', 0),
(9, 'jumbo', 0),
(10, 'crack', 0),
(11, 'soft shell', 0);

-- --------------------------------------------------------

--
-- Table structure for table `ep_feeds`
--

CREATE TABLE `ep_feeds` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_feeds`
--

INSERT INTO `ep_feeds` (`id`, `name`, `description`) VALUES
(1, 'booster', 'ulit'),
(2, 'starter', 'This feed is specifically formulated for newly hatched chicks and provides them with the essential nutrients needed for healthy growth and development during their early stages.');

-- --------------------------------------------------------

--
-- Table structure for table `ep_feeds_consumption`
--

CREATE TABLE `ep_feeds_consumption` (
  `id` int(11) NOT NULL,
  `feed_id` int(11) NOT NULL,
  `consumed` int(11) NOT NULL,
  `disposed` int(11) NOT NULL,
  `remaining` int(11) NOT NULL,
  `remarks` text NOT NULL,
  `date_procured` date NOT NULL,
  `staff_id` int(11) NOT NULL,
  `building_id` int(11) NOT NULL,
  `log_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_feeds_consumption`
--

INSERT INTO `ep_feeds_consumption` (`id`, `feed_id`, `consumed`, `disposed`, `remaining`, `remarks`, `date_procured`, `staff_id`, `building_id`, `log_date`) VALUES
(1, 2, 2, 1, 11, 'sample', '2023-08-05', 2, 1, '2023-08-05 09:58:39'),
(2, 1, 8, 2, 490, 'sample uulit', '2023-08-05', 2, 1, '2023-08-05 09:59:07'),
(3, 1, 1, 2, 487, 'final testing 101', '2023-08-05', 2, 1, '2023-08-05 10:49:59');

-- --------------------------------------------------------

--
-- Table structure for table `ep_feeds_inventory`
--

CREATE TABLE `ep_feeds_inventory` (
  `id` int(11) NOT NULL,
  `feed_id` int(11) NOT NULL,
  `date_received` date NOT NULL,
  `quantity` int(11) NOT NULL,
  `supplier` varchar(50) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `log_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_feeds_inventory`
--

INSERT INTO `ep_feeds_inventory` (`id`, `feed_id`, `date_received`, `quantity`, `supplier`, `amount`, `log_date`) VALUES
(1, 1, '2023-08-03', 500, 'Mercury Drugs', 2000, '2023-08-03 05:08:12'),
(2, 2, '2023-08-08', 14, 'Nido', 14000, '2023-08-05 09:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `ep_locations`
--

CREATE TABLE `ep_locations` (
  `location_id` int(11) NOT NULL,
  `location_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_locations`
--

INSERT INTO `ep_locations` (`location_id`, `location_name`) VALUES
(1, 'Bulacan'),
(3, 'Laguna');

-- --------------------------------------------------------

--
-- Table structure for table `ep_medication_intake`
--

CREATE TABLE `ep_medication_intake` (
  `id` int(11) NOT NULL,
  `medicine_id` int(11) NOT NULL,
  `intake` int(11) NOT NULL,
  `disposed` int(11) NOT NULL,
  `remaining` int(11) NOT NULL,
  `remarks` text NOT NULL,
  `date_procured` date NOT NULL,
  `staff_id` int(11) NOT NULL,
  `building_id` int(11) NOT NULL,
  `log_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_medication_intake`
--

INSERT INTO `ep_medication_intake` (`id`, `medicine_id`, `intake`, `disposed`, `remaining`, `remarks`, `date_procured`, `staff_id`, `building_id`, `log_date`) VALUES
(1, 1, 12, 15, 288, 'testing 101', '2023-07-28', 2, 1, '2023-07-28 06:56:30'),
(2, 3, 10, 10, 90, 'tenten', '2023-07-28', 2, 1, '2023-07-28 06:59:12'),
(3, 1, 8, 10, 270, 'sampol', '2023-07-28', 2, 2, '2023-08-01 07:46:31'),
(4, 1, 5, 4, 261, 'bigis', '2023-08-01', 2, 1, '2023-08-03 01:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `ep_medicine`
--

CREATE TABLE `ep_medicine` (
  `medicine_id` int(11) NOT NULL,
  `medicine_name` varchar(100) NOT NULL,
  `dosage_instructions` text NOT NULL,
  `usage_indication` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_medicine`
--

INSERT INTO `ep_medicine` (`medicine_id`, `medicine_name`, `dosage_instructions`, `usage_indication`) VALUES
(1, 'Cevac® Broiler ND K', 'CEVAC® BROILER ND K contains the La Sota strain of Newcastle disease virus, in inactivated and concentrated form, homogenised with oil adjuvant and merthiolate as a preservative.', 'CEVAC® BROILER ND K is recommended for the vaccination of young chickens against Newcastle Disease (ND), to reinforce the immunisation already induced by the live ND vaccine, in case of high infective pressure.\r\n '),
(3, 'Ivermectin', 'For the treatment of an infestation, repeat doses are required, often weekly three times.', 'In original packing below 25ºC and out of reach of children.\r\n\r\nSold in the UK as Ivomec, Xeno 200, Noromectin, Harka Mectin, Heartgard30 and Acarexx.');

-- --------------------------------------------------------

--
-- Table structure for table `ep_medicine_inventory`
--

CREATE TABLE `ep_medicine_inventory` (
  `id` int(11) NOT NULL,
  `medicine_id` int(11) NOT NULL,
  `date_received` date NOT NULL,
  `quantity` int(11) NOT NULL,
  `expiration_date` date NOT NULL,
  `supplier` varchar(50) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `log_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_medicine_inventory`
--

INSERT INTO `ep_medicine_inventory` (`id`, `medicine_id`, `date_received`, `quantity`, `expiration_date`, `supplier`, `amount`, `log_date`) VALUES
(1, 1, '2023-07-19', 250, '2025-05-16', 'Unilever', 9000, '2023-07-25 05:42:36'),
(2, 1, '2023-07-24', 65, '2026-07-18', 'United Neon', 10000, '2023-07-25 05:52:44'),
(3, 3, '2023-05-09', 100, '2025-07-19', 'Mercury Drugs', 2450, '2023-07-26 09:19:46'),
(6, 3, '2023-07-26', 10, '2028-05-26', 'Mercury Drugs', 245, '2023-07-26 09:17:20'),
(7, 1, '2023-08-02', 20, '2027-10-27', 'Rain Medicine', 500, '2023-08-01 00:00:19');

-- --------------------------------------------------------

--
-- Table structure for table `ep_users`
--

CREATE TABLE `ep_users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('admin','staff') NOT NULL,
  `status` int(1) NOT NULL COMMENT '1-active\r\n2-inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_users`
--

INSERT INTO `ep_users` (`user_id`, `first_name`, `middle_name`, `last_name`, `username`, `password`, `user_type`, `status`) VALUES
(1, 'vincent kyle', 'torres', 'rinoza', 'kylerinoza', '673e84a58604cbb968bf693f31e1dc48', 'admin', 1),
(2, 'jojo', 'Cruz', 'Reyes', 'jomaricruz', '1240994011c43a9248d59464f89856eb', 'staff', 1),
(3, 'Juan', 'Santos', 'Dela Cruz', 'juandelacruz', '447812a4f56887ac0395842ce13e6103', 'admin', 0),
(4, 'Edd', 'Nizal', 'Tubigan', 'russeltubigan', '1ffe314a2c6046120577066d1168ea04', 'staff', 0),
(5, 'Michael', 'S', 'Ramilo', 'michaelramilo', '6cd3f6845ec4a57af21f905e7feb4520', 'admin', 0),
(7, 'Lina', 'Cruz', 'Hernandez', 'linahernandez', '09eddbad51cbe96bee6a4627e195b5d9', 'admin', 1),
(8, 'michael', 's', 'ramilo', 'mikeramilo', 'd31b5e107aad913f679e172f9a9a8a03', 'admin', 0),
(9, 'Norvin', 'Benitez', 'Perez', 'norvinkyle', '45d1ab4f045ed2b214bf100aaf1cfb6d', 'staff', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ep_user_building`
--

CREATE TABLE `ep_user_building` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `building_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_user_building`
--

INSERT INTO `ep_user_building` (`id`, `user_id`, `building_id`) VALUES
(1, 2, 2),
(2, 2, 1),
(8, 9, 2),
(9, 9, 4),
(10, 9, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ep_building`
--
ALTER TABLE `ep_building`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ep_chicken`
--
ALTER TABLE `ep_chicken`
  ADD PRIMARY KEY (`chicken_id`),
  ADD KEY `ep_chicken_ibfk_1` (`building_id`),
  ADD KEY `ep_chicken_ibfk_2` (`staff_id`);

--
-- Indexes for table `ep_chicks`
--
ALTER TABLE `ep_chicks`
  ADD PRIMARY KEY (`chick_id`);

--
-- Indexes for table `ep_egg_production`
--
ALTER TABLE `ep_egg_production`
  ADD PRIMARY KEY (`egg_production_id`),
  ADD KEY `building_id` (`building_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ep_egg_segregation`
--
ALTER TABLE `ep_egg_segregation`
  ADD PRIMARY KEY (`segregation_id`);

--
-- Indexes for table `ep_egg_types`
--
ALTER TABLE `ep_egg_types`
  ADD PRIMARY KEY (`egg_type_id`);

--
-- Indexes for table `ep_feeds`
--
ALTER TABLE `ep_feeds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ep_feeds_consumption`
--
ALTER TABLE `ep_feeds_consumption`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ep_feeds_inventory`
--
ALTER TABLE `ep_feeds_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ep_locations`
--
ALTER TABLE `ep_locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `ep_medication_intake`
--
ALTER TABLE `ep_medication_intake`
  ADD PRIMARY KEY (`id`),
  ADD KEY `building_id` (`building_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `ep_medication_intake_ibfk_2` (`medicine_id`);

--
-- Indexes for table `ep_medicine`
--
ALTER TABLE `ep_medicine`
  ADD PRIMARY KEY (`medicine_id`);

--
-- Indexes for table `ep_medicine_inventory`
--
ALTER TABLE `ep_medicine_inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medicine_id` (`medicine_id`);

--
-- Indexes for table `ep_users`
--
ALTER TABLE `ep_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `ep_user_building`
--
ALTER TABLE `ep_user_building`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `building_id` (`building_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ep_building`
--
ALTER TABLE `ep_building`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ep_chicken`
--
ALTER TABLE `ep_chicken`
  MODIFY `chicken_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ep_chicks`
--
ALTER TABLE `ep_chicks`
  MODIFY `chick_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ep_egg_production`
--
ALTER TABLE `ep_egg_production`
  MODIFY `egg_production_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `ep_egg_segregation`
--
ALTER TABLE `ep_egg_segregation`
  MODIFY `segregation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ep_egg_types`
--
ALTER TABLE `ep_egg_types`
  MODIFY `egg_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `ep_feeds`
--
ALTER TABLE `ep_feeds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ep_feeds_consumption`
--
ALTER TABLE `ep_feeds_consumption`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ep_feeds_inventory`
--
ALTER TABLE `ep_feeds_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ep_locations`
--
ALTER TABLE `ep_locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ep_medication_intake`
--
ALTER TABLE `ep_medication_intake`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ep_medicine`
--
ALTER TABLE `ep_medicine`
  MODIFY `medicine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ep_medicine_inventory`
--
ALTER TABLE `ep_medicine_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ep_users`
--
ALTER TABLE `ep_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ep_user_building`
--
ALTER TABLE `ep_user_building`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ep_chicken`
--
ALTER TABLE `ep_chicken`
  ADD CONSTRAINT `ep_chicken_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `ep_user_building` (`building_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ep_chicken_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `ep_user_building` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ep_egg_production`
--
ALTER TABLE `ep_egg_production`
  ADD CONSTRAINT `ep_egg_production_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `ep_building` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ep_egg_production_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `ep_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ep_medication_intake`
--
ALTER TABLE `ep_medication_intake`
  ADD CONSTRAINT `ep_medication_intake_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `ep_user_building` (`building_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ep_medication_intake_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `ep_user_building` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ep_medicine_inventory`
--
ALTER TABLE `ep_medicine_inventory`
  ADD CONSTRAINT `ep_medicine_inventory_ibfk_1` FOREIGN KEY (`medicine_id`) REFERENCES `ep_medicine` (`medicine_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ep_user_building`
--
ALTER TABLE `ep_user_building`
  ADD CONSTRAINT `ep_user_building_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `ep_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ep_user_building_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `ep_building` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
