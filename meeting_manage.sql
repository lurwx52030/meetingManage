-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 16, 2023 at 06:31 PM
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

CREATE TABLE `meeting` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `meetingRoomId` varchar(255) DEFAULT NULL,
  `creatorId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meeting`
--

INSERT INTO `meeting` (`id`, `name`, `start`, `end`, `meetingRoomId`, `creatorId`) VALUES
('M030', 'asd', '2023-07-07 18:30:00', '2023-07-07 19:30:00', 'A001', 'A124'),
('M044', 'asd', '2023-07-07 15:30:00', '2023-07-07 16:30:00', 'A001', 'A124');

--
-- Triggers `meeting`
--
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
(6, 'A124', 'M044', '2023-07-07 15:50:00', '2023-07-07 15:50:00');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_room`
--

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
(44);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

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
('A124', 'uuu', 'asdfgh', '464de65c5d7e1b7ee704d3ab6fbef7090810eb6bb271a8541ebefc52c684979de76c536aa0ad7dbe991bef7e4cfe76b58bcf6523372a3e47b38cf405654c0d8b', 'b35baaed72043b266866fa030f3979e1', 'employee', NULL),
('A125', 'asdf', 'zxcv', 'bb3f3c17f6ce26020326bb800a165433420415e05098e45a38b3ef68892b2789a43d9b6693eb657cc0ca84634abbd53ca8474b87318b535df72ac93f4f3283f2', '59db7b6b70937205af0f2caf232c0b14', 'admin', NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `meeting_sequence`
--
ALTER TABLE `meeting_sequence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

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
  ADD CONSTRAINT `FK_58f476a39e1b8c0ea2ceab23552` FOREIGN KEY (`meetingId`) REFERENCES `meeting` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
