-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： db:3306
-- 產生時間： 2023 年 10 月 20 日 12:44
-- 伺服器版本： 5.7.43
-- PHP 版本： 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `meeting_manage`
--
CREATE DATABASE IF NOT EXISTS `meeting_manage` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `meeting_manage`;

-- --------------------------------------------------------

--
-- 資料表結構 `meeting`
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
  `notificationTime` int(11) DEFAULT NULL,
  `createTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `meeting`
--

INSERT INTO `meeting` (`id`, `name`, `start`, `end`, `meetingRoomId`, `creatorId`, `isCheckin`, `checkLimit`, `isCheckout`, `notificationTime`, `createTime`) VALUES
('M056', 'rrr', '2023-10-18 21:07:00', '2023-10-18 22:07:00', 'A001', 'A124', 0, 5, 0, 15, '2023-10-18 20:08:11'),
('M057', 'aaa', '2023-10-19 22:19:00', '2023-10-19 23:19:00', 'A001', 'A124', 0, 5, 0, 0, '2023-10-19 21:19:57'),
('M058', 'ddda', '2023-10-20 21:23:00', '2023-10-20 22:23:00', 'A001', 'A121', 0, 5, 0, 0, '2023-10-19 21:23:19'),
('M059', '999', '2023-10-21 07:00:00', '2023-10-21 11:00:00', 'A001', 'A121', 0, 5, 0, 15, '2023-10-20 00:00:53'),
('M060', 'ttt', '2023-10-20 03:53:00', '2023-10-20 10:55:00', 'A001', 'A121', 0, 5, 0, 5, '2023-10-20 00:45:47');

--
-- 觸發器 `meeting`
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
-- 資料表結構 `meeting_member`
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
-- 傾印資料表的資料 `meeting_member`
--

INSERT INTO `meeting_member` (`id`, `participantId`, `meetingId`, `singin`, `singout`) VALUES
(45, 'A121', 'M056', NULL, NULL),
(46, 'P555', 'M056', NULL, NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `meeting_room`
--

DROP TABLE IF EXISTS `meeting_room`;
CREATE TABLE `meeting_room` (
  `id` varchar(255) NOT NULL,
  `name` varchar(15) NOT NULL COMMENT '會議室名稱',
  `location` varchar(15) NOT NULL COMMENT '會議室位置'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `meeting_room`
--

INSERT INTO `meeting_room` (`id`, `name`, `location`) VALUES
('A001', 'MA324', '管一三樓'),
('A002', 'MA212', '管一二樓');

-- --------------------------------------------------------

--
-- 資料表結構 `meeting_sequence`
--

DROP TABLE IF EXISTS `meeting_sequence`;
CREATE TABLE `meeting_sequence` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `meeting_sequence`
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
(50),
(51),
(52),
(53),
(54),
(55),
(56),
(57),
(58),
(59),
(60);

-- --------------------------------------------------------

--
-- 資料表結構 `user`
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
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `name`, `account`, `password`, `salt`, `role`, `lineid`) VALUES
('A121', 'asdf', 'kzxcv', '607015c6ac3c190d38b056d548ccbd546f9dbd1bed77f750b790e725fd6d0ed69a6bd81185c68ac4d9b5054c7f8b1c9a38bde90d7058664773bd09fda1cd5a34', 'fb10e6f1325081d30104e420baba2433', 'employee', NULL),
('A124', 'uuu', 'asdfgh', 'dcdfe1e77ec35072007f8944428ae364eae257f9a6faeba628275fb1e067d1075944bb38454a5b21ea058745e4620f2f200fcc8f545407e6791cc6c41d5326e9', '41fb705682d413ca6496a9a38182567c', 'employee', NULL),
('A125', 'asdf', 'zxcv', 'c9d12d8edc28ae8738c0e296bb114065e6dd51dbac7f951acf12a37d29425364a9137c05d53f3a89965dcb770910e00cb302b60abaf1fdecc6f2f5871567023d', 'f3d78e0bc37fb5b4a69299ab047c9fbe', 'admin', NULL),
('D123', 'd', 'd', '48cef256a29d595dc0f240dff0c64b30279679ffe0d18e891cb1c42d656f7bebd94a70518a1c8dd7b862d15c41d3dc61d5b854873762770a73c7308ccc1bbb5f', 'e74cba17935a15d81317118b809cc126', 'admin', NULL),
('P555', 'dllm', 'knnzxc', 'd5c2396b9bc38914e5ac2b6fb563ac3e3a543edcc640a9f22cdc28f591782f06c91a43446db3a6f8b5033047c2bf1b269a838b6cc5c8d6a90bd0f30d09d62442', '25aaeab029ad36ffe69a76ab2ea369b6', 'employee', NULL);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a00e1c5af408052c92418ea9bec` (`meetingRoomId`),
  ADD KEY `FK_fe775c687e31ff7950e35650c40` (`creatorId`);

--
-- 資料表索引 `meeting_member`
--
ALTER TABLE `meeting_member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_34b5654c29e64f0a80ff5f2c691` (`participantId`),
  ADD KEY `FK_58f476a39e1b8c0ea2ceab23552` (`meetingId`);

--
-- 資料表索引 `meeting_room`
--
ALTER TABLE `meeting_room`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `meeting_sequence`
--
ALTER TABLE `meeting_sequence`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_4ab2df0a57a74fdf904e0e2708` (`account`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `meeting_member`
--
ALTER TABLE `meeting_member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `meeting_sequence`
--
ALTER TABLE `meeting_sequence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `meeting`
--
ALTER TABLE `meeting`
  ADD CONSTRAINT `FK_a00e1c5af408052c92418ea9bec` FOREIGN KEY (`meetingRoomId`) REFERENCES `meeting_room` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fe775c687e31ff7950e35650c40` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的限制式 `meeting_member`
--
ALTER TABLE `meeting_member`
  ADD CONSTRAINT `FK_34b5654c29e64f0a80ff5f2c691` FOREIGN KEY (`participantId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_58f476a39e1b8c0ea2ceab23552` FOREIGN KEY (`meetingId`) REFERENCES `meeting` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
