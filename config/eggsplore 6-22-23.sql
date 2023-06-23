-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2023 at 11:18 AM
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
  `name` varchar(50) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ep_building`
--

INSERT INTO `ep_building` (`id`, `name`, `capacity`) VALUES
(1, 'United Neon', 500),
(2, 'The Chick-Inn', 1390);

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
(1, 'vincent kyle', 'torres', 'rinoza', 'kylerinoza', '673e84a58604cbb968bf693f31e1dc48', 'administrator', 1),
(2, 'jojo', 'cruz', 'reyes', 'jojoreyes', '1240994011c43a9248d59464f89856eb', 'staff', 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ep_users`
--
ALTER TABLE `ep_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ep_user_bulding`
--
ALTER TABLE `ep_user_bulding`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

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
