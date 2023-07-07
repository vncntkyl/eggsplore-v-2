-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2023 at 10:21 AM
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
(4, 3, 147);

-- --------------------------------------------------------

--
-- Table structure for table `ep_egg_production`
--

CREATE TABLE `ep_egg_production` (
  `egg_production_id` int(11) NOT NULL,
  `date_produced` date NOT NULL,
  `egg_count` int(11) NOT NULL,
  `building_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_egg_production`
--

INSERT INTO `ep_egg_production` (`egg_production_id`, `date_produced`, `egg_count`, `building_id`, `user_id`, `log_date`) VALUES
(1, '2023-07-05', 125, 2, 2, '2023-07-07 11:23:43'),
(2, '2023-07-07', 250, 1, 2, '2023-07-07 11:56:23'),
(3, '2023-07-07', 165, 1, 2, '2023-07-07 13:19:12'),
(4, '2023-07-04', 180, 1, 2, '2023-07-07 13:38:16');

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
(1, 'booster', 'sample description'),
(2, 'starter', 'This feed is specifically formulated for newly hatched chicks and provides them with the essential nutrients needed for healthy growth and development during their early stages.');

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
(1, 'CEVAC® BROILER ND K', 'CEVAC® BROILER ND K contains the La Sota strain of Newcastle disease virus, in inactivated and concentrated form, homogenised with oil adjuvant and merthiolate as a preservative.', 'CEVAC® BROILER ND K is recommended for the vaccination of young chickens against Newcastle Disease (ND), to reinforce the immunisation already induced by the live ND vaccine, in case of high infective pressure.\r\n ');

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
(6, 'Norvin', 'Benitez', 'Perez', 'norvinkyle', '45d1ab4f045ed2b214bf100aaf1cfb6d', 'staff', 0),
(7, 'Lina', 'Cruz', 'Hernandez', 'linahernandez', '09eddbad51cbe96bee6a4627e195b5d9', 'admin', 1),
(8, 'michael', 's', 'ramilo', 'mikeramilo', 'd31b5e107aad913f679e172f9a9a8a03', 'admin', 0),
(9, 'Norvin', 'Benitez', 'Perez', 'norvinkyle', 'd75d75188d0a3e72acaf5799d10b848f', 'staff', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ep_user_bulding`
--

CREATE TABLE `ep_user_bulding` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `building_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_user_bulding`
--

INSERT INTO `ep_user_bulding` (`id`, `user_id`, `building_id`) VALUES
(1, 2, 2),
(2, 2, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ep_building`
--
ALTER TABLE `ep_building`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ep_egg_production`
--
ALTER TABLE `ep_egg_production`
  ADD PRIMARY KEY (`egg_production_id`),
  ADD KEY `building_id` (`building_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ep_feeds`
--
ALTER TABLE `ep_feeds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ep_locations`
--
ALTER TABLE `ep_locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `ep_medicine`
--
ALTER TABLE `ep_medicine`
  ADD PRIMARY KEY (`medicine_id`);

--
-- Indexes for table `ep_users`
--
ALTER TABLE `ep_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `ep_user_bulding`
--
ALTER TABLE `ep_user_bulding`
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
-- AUTO_INCREMENT for table `ep_egg_production`
--
ALTER TABLE `ep_egg_production`
  MODIFY `egg_production_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ep_feeds`
--
ALTER TABLE `ep_feeds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ep_locations`
--
ALTER TABLE `ep_locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ep_medicine`
--
ALTER TABLE `ep_medicine`
  MODIFY `medicine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ep_users`
--
ALTER TABLE `ep_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ep_user_bulding`
--
ALTER TABLE `ep_user_bulding`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ep_egg_production`
--
ALTER TABLE `ep_egg_production`
  ADD CONSTRAINT `ep_egg_production_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `ep_building` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ep_egg_production_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `ep_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ep_user_bulding`
--
ALTER TABLE `ep_user_bulding`
  ADD CONSTRAINT `ep_user_bulding_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `ep_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ep_user_bulding_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `ep_building` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
