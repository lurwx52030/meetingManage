-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 16, 2023 at 07:36 AM
-- Server version: 5.7.24
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `meeting_manage`
--
CREATE DATABASE IF NOT EXISTS `meeting_manage` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `meeting_manage`;

-- --------------------------------------------------------

--
-- Table structure for table `meeting`
--

DROP TABLE IF EXISTS `meeting`;
CREATE TABLE `meeting` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `meetingRoomId` varchar(255) DEFAULT NULL,
  `creatorId` varchar(255) DEFAULT NULL,
  `isCheckin` tinyint(4) NOT NULL DEFAULT '0',
  `checkLimit` int(11) NOT NULL DEFAULT '5',
  `isCheckout` tinyint(4) NOT NULL DEFAULT '0',
  `notificationTime` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meeting`
--

INSERT INTO `meeting` (`id`, `name`, `start`, `end`, `meetingRoomId`, `creatorId`, `isCheckin`, `checkLimit`, `isCheckout`, `notificationTime`) VALUES
('M030', 'zzzz', '2022-07-07 18:25:00', '2022-07-07 19:25:00', 'A001', 'A124', 0, 1, 0, 15),
('M046', 'asd', '2023-07-08 15:30:00', '2023-07-08 17:30:00', 'A001', 'A124', 0, 5, 0, 10);

--
-- Triggers `meeting`
--
DROP TRIGGER IF EXISTS `meetingroomAutoId`;
DELIMITER $$
CREATE TRIGGER `meetingroomAutoId` BEFORE INSERT ON `meeting` FOR EACH ROW BEGIN
    INSERT INTO meeting_sequence VALUES (NULL);
    SET NEW.id=concat('M',right(1000+Last_insert_id(),3));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `meetingroom_borrow`
--

DROP TABLE IF EXISTS `meetingroom_borrow`;
CREATE TABLE `meetingroom_borrow` (
  `id` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `meetingRoomId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `meeting_member`
--

DROP TABLE IF EXISTS `meeting_member`;
CREATE TABLE `meeting_member` (
  `id` int(11) NOT NULL,
  `participantId` varchar(255) DEFAULT NULL,
  `meetingId` varchar(255) DEFAULT NULL,
  `singin` datetime DEFAULT NULL,
  `singout` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meeting_member`
--

INSERT INTO `meeting_member` (`id`, `participantId`, `meetingId`, `singin`, `singout`) VALUES
(10, 'A124', 'M030', '2023-07-07 18:45:00', '2023-07-07 19:25:00');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_room`
--

DROP TABLE IF EXISTS `meeting_room`;
CREATE TABLE `meeting_room` (
  `id` varchar(255) NOT NULL,
  `name` varchar(15) NOT NULL COMMENT '會議室名稱',
  `location` varchar(15) NOT NULL COMMENT '會議室位置'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meeting_room`
--

INSERT INTO `meeting_room` (`id`, `name`, `location`) VALUES
('A001', 'MA324', '管一三樓'),
('A002', 'MA212', '管一二樓');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_sequence`
--

DROP TABLE IF EXISTS `meeting_sequence`;
CREATE TABLE `meeting_sequence` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meeting_sequence`
--

INSERT INTO `meeting_sequence` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31),
(32),
(33),
(34),
(35),
(36),
(37),
(38),
(39),
(40),
(41),
(42),
(43),
(44),
(45),
(46),
(47),
(48),
(49),
(50);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(15) NOT NULL COMMENT '姓名',
  `account` varchar(20) NOT NULL COMMENT '帳號',
  `password` varchar(255) NOT NULL COMMENT '加鹽並hash過後的密碼',
  `salt` varchar(255) NOT NULL COMMENT '密碼加鹽',
  `role` enum('admin','employee') NOT NULL DEFAULT 'employee',
  `lineid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `account`, `password`, `salt`, `role`, `lineid`) VALUES
('A124', 'uuu', 'asdfgh', 'dcdfe1e77ec35072007f8944428ae364eae257f9a6faeba628275fb1e067d1075944bb38454a5b21ea058745e4620f2f200fcc8f545407e6791cc6c41d5326e9', '41fb705682d413ca6496a9a38182567c', 'employee', NULL),
('A125', 'asdf', 'zxcv', 'c9d12d8edc28ae8738c0e296bb114065e6dd51dbac7f951acf12a37d29425364a9137c05d53f3a89965dcb770910e00cb302b60abaf1fdecc6f2f5871567023d', 'f3d78e0bc37fb5b4a69299ab047c9fbe', 'admin', NULL),
('A222', 'aaaddd', 'aaaddd', '70144fd1620a8eb3c38a6e91058757413e93b4daa9469ecdfa466d57c79d7482db35c61a605e8bdd68825b569a9ba1295cbbfecddeacd72441919b9dd07063d1', '8fc64327a17b0a5fe1dbc80179c82c53', 'employee', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a00e1c5af408052c92418ea9bec` (`meetingRoomId`),
  ADD KEY `FK_fe775c687e31ff7950e35650c40` (`creatorId`);

--
-- Indexes for table `meetingroom_borrow`
--
ALTER TABLE `meetingroom_borrow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ba36ba5095271c4e90c4e17b952` (`meetingRoomId`);

--
-- Indexes for table `meeting_member`
--
ALTER TABLE `meeting_member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_34b5654c29e64f0a80ff5f2c691` (`participantId`),
  ADD KEY `FK_58f476a39e1b8c0ea2ceab23552` (`meetingId`);

--
-- Indexes for table `meeting_room`
--
ALTER TABLE `meeting_room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meeting_sequence`
--
ALTER TABLE `meeting_sequence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_4ab2df0a57a74fdf904e0e2708` (`account`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meetingroom_borrow`
--
ALTER TABLE `meetingroom_borrow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meeting_member`
--
ALTER TABLE `meeting_member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `meeting_sequence`
--
ALTER TABLE `meeting_sequence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `meeting`
--
ALTER TABLE `meeting`
  ADD CONSTRAINT `FK_a00e1c5af408052c92418ea9bec` FOREIGN KEY (`meetingRoomId`) REFERENCES `meeting_room` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fe775c687e31ff7950e35650c40` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `meetingroom_borrow`
--
ALTER TABLE `meetingroom_borrow`
  ADD CONSTRAINT `FK_ba36ba5095271c4e90c4e17b952` FOREIGN KEY (`meetingRoomId`) REFERENCES `meeting_room` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `meeting_member`
--
ALTER TABLE `meeting_member`
  ADD CONSTRAINT `FK_34b5654c29e64f0a80ff5f2c691` FOREIGN KEY (`participantId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_58f476a39e1b8c0ea2ceab23552` FOREIGN KEY (`meetingId`) REFERENCES `meeting` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
